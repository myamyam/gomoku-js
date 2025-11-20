import express from "express";
import path from "path";
import { Server } from "socket.io";
import http from "http";

const __dirname = path.resolve() + "/src";
const __viewroot = path.join(__dirname, "/public/views");

const app = express();
const port = 3000;

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __viewroot });
});

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

///////////////////////////////////////////////////////////

let publicRoom = [];

function getJoinedRoomName(socket) {
  return Array.from(socket.rooms)[1];
}

function getPublicRoom(name) {
  return publicRoom.find((room) => room.name == name);
}

function findSocketByID(id) {
  return wsServer.sockets.sockets.get(id);
}

function countRoom(name) {
  return wsServer.sockets.adapter.rooms.get(name).size;
}

function checkDuplicateRoomName(name) {
  if (wsServer.sockets.adapter.rooms.get(name)) {
    return false;
  } else {
    return true;
  }
}

function emitPlayerChange(room) {
  wsServer.in(room.name).emit("player_change", {
    blackPlayer: room.blackPlayer,
    whitePlayer: room.whitePlayer,
  });

  if (room.blackPlayer !== "" && room.whitePlayer !== "") {
    room.takes = [];
    findSocketByID(room.blackPlayer).emit("player_select");
  }
}

function getSafeRoomData(room) {
  return {
    name: room.name,
    blackPlayer: room.blackPlayer,
    whitePlayer: room.whitePlayer,
    takes: room.takes,
    remaining: room.remaining ?? 30,
  };
}

function getSafeRoomList(){
  return publicRoom.map(getSafeRoomData);
}

function enterRoom(socket, name) {
  const room = getPublicRoom(name);
  console.log(`Socket ${socket.id} is entering room ${name}.`);

  if (room === undefined) {
    socket.emit("error", "정상적인 방이 아닙니다.");
    return;
  }

  socket.join(name);
  socket.emit("room_enter", getSafeRoomData(room));
  wsServer.to(name).emit("message", `${socket.id} 님이 입장하셨습니다.`);
}

function leaveRoom(socket) {
  const name = getJoinedRoomName(socket);

  console.log(`Socket ${socket.id} is leaving room ${name}.`);

  if (name != undefined) {
    if (countRoom(name) == 1) {
      console.log(`Remove room ${name}`);
      publicRoom = publicRoom.filter((value) => value.name != name);
      wsServer.sockets.emit("room_list", getSafeRoomList());
    } else {
      const room = getPublicRoom(name);
      if (room.blackPlayer === socket.id) {
        room.blackPlayer = "";
        emitPlayerChange(room);
      } else if (room.whitePlayer === socket.id) {
        room.whitePlayer = "";
        emitPlayerChange(room);
      }

      wsServer.to(name).emit("message", `${socket.id} 님이 퇴장하셨습니다.`);
    }
    socket.leave(name);
  }
}

function checkOmokCompleted(coord, takes) {
  const offset = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
  ];

  return offset.some((dir) => {
    let streak = 1;
    const type = (takes.length - 1) % 2;

    for (
      let x = coord.x + dir.x, y = coord.y + dir.y;
      x > 0 && x < 15 && y > 0 && y < 15;
      x += dir.x, y += dir.y
    ) {
      if (takes.some((t, index) => t.x == x && t.y == y && index % 2 == type))
        streak++;
      else break;
    }

    for (
      let x = coord.x - dir.x, y = coord.y - dir.y;
      x > 0 && x < 15 && y > 0 && y < 15;
      x -= dir.x, y -= dir.y
    ) {
      if (takes.some((t, index) => t.x == x && t.y == y && index % 2 == type))
        streak++;
      else break;
    }

    if (streak === 5) {
      return true;
    }
  });
}
function startTurnTimer(room) {
  if (room.timer) clearTimeout(room.timer);
  if (room.interval) clearInterval(room.interval);

  room.remaining = room.turnTime;

  wsServer.in(room.name).emit("timer_init", {
    remaining: room.remaining
  });

  room.interval = setInterval(() => {
    room.remaining -= 1;
    wsServer.in(room.name).emit("timer_tick", {
      remaining: room.remaining
    });
    if (room.remaining <= 0 ) {
      clearInterval(room.interval);
    }
  }, 1000);

  room.timer = setTimeout(() => {
    handleTimeout(room);
  }, room.turnTime * 1000);
}

function handleTimeout(room) {
  clearInterval(room.interval);

  const isBlackTurn = room.takes.length % 2 === 0;
  const loser = isBlackTurn ? "black" : "white";
  const winner = isBlackTurn ? "white" : "black";

  wsServer.in(room.name).emit("timeout", { loser, winner });
  wsServer.in(room.name).emit("game_end", winner);

  room.blackPlayer = "";
  room.whitePlayer = "";
  room.takes = [];

  emitPlayerChange(room);
}

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket event: ${event}`);
  });

  socket.on("room_list", () => {
    socket.emit("room_list", getSafeRoomList());
  });

  socket.on("room_new", (name) => {
    name = name.trim();
    console.log(`Socket ${socket.id} is creating room ${name}.`);

    if (socket.rooms.size > 1) {
      console.log(`socket ${socket.id} is already in room.`);
      console.log(socket.rooms);
      socket.emit("error", "다른 방에 참가중입니다.");
      return;
    }

    if (!checkDuplicateRoomName(name)) {
      console.log(`Room name ${name} already exists.`);
      socket.emit("error", "이미 존재하는 방입니다.");
      return;
    }

    const roomInfo = {
      name: "room",
      blackPlayer: "",
      whitePlayer: "",
      takes: [],
      turnTime:30,
      timer:null,
      interval:null,
      remaining:30
    };

    roomInfo.name = name;

    publicRoom.push(roomInfo);
    wsServer.sockets.emit("room_list", getSafeRoomList());

    enterRoom(socket, name);
  });

  socket.on("room_enter", (name) => {
    if (socket.rooms.size > 1) {
      console.log(`socket ${socket.id} is already in room.`);
      console.log(socket.rooms);
      socket.emit("error", "다른 방에 참가중입니다.");
      return;
    }

    enterRoom(socket, name);
  });

  socket.on("room_leave", () => {
    leaveRoom(socket);
    socket.emit("room_leave");
  });

  socket.on("chat_message", (text) =>{
    const roomName=getJoinedRoomName(socket);
    const room = getPublicRoom(roomName);

    if(!room){
      socket.emit("error", "방에 입장하지 않았습니다.");
      return;
    }
    const isSpectator=
      room.blackPlayer!==socket.id&&
      room.whitePlayer!==socket.id;

    if(isSpectator){
      socket.emit("error", "관전자는 채팅에 참여할 수 없습니다.");
      return;
    }

    wsServer.in(roomName).emit("chat_message", {
      sender:socket.id,
      text:text,
      timestamp:Date.now(),
    });
  });

  socket.on("player_change", (color) => {
    const roomName = getJoinedRoomName(socket);
    const room = getPublicRoom(roomName);

    if (color === "black") {
      if (room.blackPlayer !== "") {
        socket.emit("error", "다른 플레이어가 참가중입니다.");
        return;
      } else {
        if (room.whitePlayer === socket.id) room.whitePlayer = "";
        room.blackPlayer = socket.id;
      }
    } else if (color === "white") {
      if (room.whitePlayer !== "") {
        socket.emit("error", "다른 플레이어가 참가중입니다.");
        return;
      } else {
        if (room.blackPlayer === socket.id) room.blackPlayer = "";
        room.whitePlayer = socket.id;
      }
    } else if (color === "spectator") {
      if (room.blackPlayer === socket.id) {
        room.blackPlayer = "";
      } else if (room.whitePlayer === socket.id) {
        room.whitePlayer = "";
      } else {
        return;
      }
    }
    if (room.blackPlayer!==""&&room.whitePlayer!==""){
      startTurnTimer(room);
    }

    emitPlayerChange(room);
  });

  socket.on("player_selected", (coord) => {
    const name = getJoinedRoomName(socket);
    const room = getPublicRoom(name);

    if (room === undefined) {
      console.log(`Room ${name} is not existing.`);
      return;
    }

    const isBlackTurn = room.takes.length % 2 == 0;

    if (isBlackTurn) {
      if (room.blackPlayer !== socket.id) {
        socket.emit("error", "흑돌 플레이어가 아닙니다.");
        return;
      }
    } else {
      if (room.whitePlayer !== socket.id) {
        socket.emit("error", "백돌 플레이어가 아닙니다.");
        return;
      }
    }

    if (
      findSocketByID(room.blackPlayer) === undefined ||
      findSocketByID(room.whitePlayer) === undefined
    ) {
      socket.emit("error", "상대가 존재하지 않습니다.");
      return;
    }

    if (
      room.takes.find((c) => c.x === coord.x && c.y === coord.y) !== undefined
    ) {
      socket.emit("error", "이미 다른 돌이 위치하고 있습니다.");
      socket.emit("player_select");
      return;
    }

    room.takes.push(coord);
    wsServer.in(name).emit("player_selected", coord);

    if (checkOmokCompleted(coord, room.takes)) {
      console.log("Omok completed!");
      if (room.timer) clearTimeout(room.timer);
      if (room.interval) clearInterval(room.interval);
      room.remaining=room.turnTime;

      wsServer.in(name).emit("game_end", isBlackTurn ? "black" : "white");
      wsServer.in(name).emit("message", `${socket.id}님이 승리하셨습니다!`);
      
      room.blackPlayer = "";
      room.whitePlayer = "";
      emitPlayerChange(room);
      return;
    }else{
      startTurnTimer(room);
    }

    if (isBlackTurn) {
      findSocketByID(room.whitePlayer).emit("player_select");
    } else {
      findSocketByID(room.blackPlayer).emit("player_select");
    }
  });

  socket.on("player_ready", () => {});

  socket.on("disconnecting", () => {
    console.log(`Socket ${socket.id} is disconnecting.`);
    leaveRoom(socket);
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});