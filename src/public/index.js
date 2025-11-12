const NewRoom =()=>{
    const handleNewRoom=(event)=>{
        event.preventDefault();
        const name=event.target.roomname.value;
        event.target.roomname.value="";
        if (name.length==0) return;
        Socket.emit("room_new", name);
    };

    return(
        <div className="newroom">
            <form className="newroom_form" onSubmit={handleNewRoom}>
                <input className="newroom_input" type="text" name="roomname" placeholder="방 이름">
                </input>
                <button classsName="newroom_submit">방 만들기</button>
            </form>
        </div>
    );
};

const RoomItem=(room)=>{
    const handleEnterRoom=()=>{
        Socket.emit("room_enter", room.name);
    };

    return(
        <li key={room.name} className="room-list_item">
            <p className="room-list_name">{room.name}</p>
            <button className="room-list_enter" onClick={handleEnterRoom}>
                입장하기
            </button>
        </li>
    );
};

const RoomList=()=>{
    const [roomList, setRoomList]=react.useState([]);

    Socket.on("room_change", (list) =>{
        setRoomList(list);
    });
    
    return(
        <div className="room-list">
            <h3>방 목록</h3>
            <ul className="room-list_container">{roomList.map(Roomitem)}</ul>
        </div>
    );
};