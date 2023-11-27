const { io, users, MAXIMUM, socketRoom } = require("./server");

io.on("connection", (socket) => {
  // socket.on("zz", (roomid) => {
  //   socket.join(roomid);
  //   console.log("zzz");
  //   socket.broadcast.to(roomid).emit("zzzzzz");
  // });
  socket.on("join-room", (roomid, id) => {
    console.log("join", id);
    socket.join(roomid);
    const users = Array.from(io.sockets.adapter.rooms.get(roomid));
    console.log(users);
    socket.emit("origin_users", users);
    // if (Object.keys(users).length > 0) {
    //   const roomClients = Array.from(io.sockets.adapter.rooms.get(roomid));
    // }
    // console.log(roomClients);
    // socket.to(roomid).emit("new_user_connected", id);
    // socket.to(roomid).emit("new_user_conn", id);
  });

  socket.on("send_offer", (offer, user, sender) => {
    io.to(user).emit("send_offer", offer, sender);
  });

  socket.on("offs", (offer, receiver, sender) => {
    console.log("offs");
    console.log("receiver = ", receiver);
    io.to(receiver).emit("offs", offer, sender);
  });

  socket.on("answers", (answer, receiver) => {
    console.log("answers");
    io.to(receiver).emit("answers", answer);
  });

  socket.on("discc", (id, room) => {
    console.log("disconn", id);
    socket.to(room).emit("disconn", id);
  });

  //
  //
  //
  socket.on("off", (offer, sender, new_user) => {
    io.to(new_user).emit("off", offer, sender);
  });

  socket.on("ans", (sender, reciever, answer) => {
    io.to(reciever).emit("ans", answer, sender);
  });

  // socket.on("send_offer_to_new_user", (offer, new_userid) => {
  //   console.log(new_userid);
  //   io.to(new_userid).emit("origin_users_offer", offer);
  // });
  //
  //
  //
  //
  //
  socket.on("offer", (offer, roomid, id) => {
    socket.to(roomid).emit("offer", offer, id);
    console.log("offer = ", "rooomid = ", roomid);
  });

  socket.on("answer", (answer, roomid) => {
    console.log("answer roomid = ", roomid);
    socket.to(roomid).emit("answer", answer);
  });

  // socket.on("answer", answer);
  socket.on("ice", (ice, sender) => {
    console.log("ice!!");
    io.to(sender).emit("icezz", ice);
    // socket.to(roomid).emit("ice", ice);
  });
  // console.log(socket.id, "connection");
  socket.on("join_room", (data) => {
    // 방이 기존에 생성되어 있다면
    if (users[data.room]) {
      // 현재 입장하려는 방에 있는 인원수
      const currentRoomLength = users[data.room].length;
      if (currentRoomLength === MAXIMUM) {
        // 인원수가 꽉 찼다면 돌아갑니다.
        socket.to(socket.id).emit("room_full");
        return;
      }

      // 여분의 자리가 있다면 해당 방 배열에 추가해줍니다.
      users[data.room] = [...users[data.room], { id: socket.id }];
    } else {
      // 방이 존재하지 않다면 값을 생성하고 추가해줍시다.
      users[data.room] = [{ id: socket.id }];
    }
    socketRoom[socket.id] = data.room;

    // 입장
    socket.join(data.room);

    // 입장하기 전 해당 방의 다른 유저들이 있는지 확인하고
    // 다른 유저가 있었다면 offer-answer을 위해 알려줍니다.
    const others = users[data.room].filter((user) => user.id !== socket.id);
    if (others.length) {
      io.sockets.to(socket.id).emit("all_users", others);
    }
  });

  socket.on("offer", (sdp, roomName) => {
    // offer를 전달받고 다른 유저들에게 전달해 줍니다.
    socket.to(roomName).emit("getOffer", sdp);
  });

  socket.on("answer", (sdp, roomName) => {
    // answer를 전달받고 방의 다른 유저들에게 전달해 줍니다.
    socket.to(roomName).emit("getAnswer", sdp);
  });

  socket.on("candidate", (candidate, roomName) => {
    // candidate를 전달받고 방의 다른 유저들에게 전달해 줍니다.
    socket.to(roomName).emit("getCandidate", candidate);
  });

  socket.on("disconnect", () => {
    // 방을 나가게 된다면 socketRoom과 users의 정보에서 해당 유저를 지워줍니다.
    const roomID = socketRoom[socket.id];

    if (users[roomID]) {
      users[roomID] = users[roomID].filter((user) => user.id !== socket.id);
      if (users[roomID].length === 0) {
        delete users[roomID];
        return;
      }
    }
    delete socketRoom[socket.id];
    socket.broadcast.to(users[roomID]).emit("user_exit", { id: socket.id });
  });
});
