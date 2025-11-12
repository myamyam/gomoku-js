import express from "express"
const app=express();
const port=3000;

wsServer.on("connection", (socket)=>{
   socket.onAny((event)=>{
    console.log('Socket event: ${event}');
   });
   
   socket.on("room_new", (name)=>{
    name=name.trim();
    console.log('Socket ${socket.id} is creating room ${name}.');

    if (socket.rooms.size > 1) {
      console.log(`socket ${socket.id} is already in room.`);
      console.log(socket.rooms);
      socket.emit("error", "이미 다른 방에 참가중입니다.");
      return;
    }

    if (!checkDuplicateRoomName(name)) {
      console.log(`Room name ${name} already exists.`);
      socket.emit("error", "동일한 방이 이미 존재합니다.");
      return;
    }

    const roomInfo={
      name: "room",
      blackPlayer:"",
      whitePlayer:"",
      takes:[],
    };

    roomInfo.name = name;
    roomInfo.blackPlayer = socket.id;

    publicRoom.push(roomInfo);
    wsServer.sockets.emit("room_change", publicRoom);

    socket.join(name);
    socket.emit("room_enter", name);

    console.log(publicRoom);
});
});

app.get("/", (req, res)=>{
    res.send("Hello World!");
});

app.listen(port, ()=>{
    console.log('Example app listening on port ${port}');
});