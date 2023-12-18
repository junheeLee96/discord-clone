// const express = require("express");
// const app = express();

// const cors = require("cors");

// const server = require("http").createServer();
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });
// const PORT = 9000;
// io.on("connection", (socket) => {
//   //
//   //
//   //
//   //
//   //
//   //
//   //
//   //
//   //
//   //
//   //
//   console.log("connection!!");
//   console.log(socket);
//   socket.on("join-room", (roomid, id, nickname) => {
//     console.log("join room");
//     socket.join(roomid);
//     // console.log("new_user,id = ", id);
//     //new user join to the room

//     //sender를 제외한 방의 모든 사람에게 메세지를 날림
//     socket.broadcast.to(roomid).emit("user-connected", id, nickname);
//     socket.on("disconnect", () => {
//       //유저의 소켓연결이 끊어졌을때

//       socket.leave(roomid);
//       //방에서 내보내고

//       //모두에게 알린다
//       socket.to(roomid).emit("user-disconnected", id);
//     });

//     socket.on("streaming-start", (roomid, id) => {
//       //sender 빼고 모든 룸안의 유저들에게 메세지를 날림
//       socket.broadcast.to(roomid).emit("streamer-start", id);
//       socket.on("streaming-disconnect", (id) => {
//         console.log("streaming stop");
//         socket.broadcast.to(roomid).emit("streaming-disconnect", id);
//       });
//     });

//     socket.on("message-send", (ms, id, roomid) => {
//       //sender를 포함한 룸 유저 전체에게 메세지
//       io.in(roomid).emit("receive-message", ms, id);
//     });

//     socket.on("zz", () => {
//       console.log("zzzz");
//     });
//   });
// });

// server.listen(PORT, () => console.log("server is running on ", PORT));

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

// cors 설정을 하지 않으면 오류가 생기게 됩니다. 설정해 줍니다.
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 8080;

// 어떤 방에 어떤 유저가 들어있는지
let users = {};
let user_roomid = {};
let rooms = {};
// socket.id기준으로 어떤 방에 들어있는지

io.on("connection", (socket) => {
  // socket.on("zz", (roomid) => {
  //   socket.join(roomid);
  //   console.log("zzz");
  //   socket.broadcast.to(roomid).emit("zzzzzz");
  // });

  socket.on("how_many_users", (roomid) => {
    let arr = [];
    if (roomid in rooms) {
      arr = [...rooms[roomid]];
    }

    console.log("arr = ", arr);

    socket.emit("there are users", arr);
  });

  socket.on("join-room", (roomid, id, nickname) => {
    socket.join(roomid);
    users[id] = nickname;
    user_roomid[id] = roomid;
    if (roomid in rooms) {
      rooms[roomid] = [...rooms[roomid], { id, nickname }];
    } else {
      rooms[roomid] = [{ id, nickname }];
    }

    console.log("user_roomid = ", user_roomid);
    console.log("rooms = ", rooms);
    console.log(rooms);
    const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomid));
    const returnValue = [];

    usersInRoom.forEach((user) => {
      returnValue.push({ id: user, nickname: users[user] });
    });
    console.log(returnValue);
    socket.emit("origin_users", returnValue);
  });

  socket.on("send_off", (offer, sender, reciever, nickname) => {
    // 오퍼
    console.log("send_off, sender = ", sender, "receiver = ", reciever);
    io.to(reciever).emit(`send_off`, offer, sender, nickname);
  });

  socket.on("send_ans", (answer, sender, reciever, nickname) => {
    // 오퍼 응답
    console.log("send_ans, sender = ", sender, "receiver = ", reciever);
    io.to(reciever).emit(`send_ans`, answer, sender, nickname);
  });

  socket.on("candidate", (ice, reciever, sender) => {
    // ice 교환 => 길찾기
    console.log("candiate, sender = ", sender, "re = ", reciever);
    io.to(reciever).emit(`candidate`, ice, sender);
  });

  socket.on("speaking", (id, roomid) => {
    socket.to(roomid).emit("speaking", id);
  });

  socket.on("renegotiate_offer", (offer, sender, reciever) => {
    io.to(reciever).emit(`renegotiate_offer`, offer, sender);
  });

  socket.on("renegotiate_answer", (answer, sender, reciever) => {
    io.to(reciever).emit(`renegotiate_answer`, answer, sender);
  });

  socket.on("disconnect", () => {
    console.log("disconnet");
    const room = user_roomid[socket.id];
    delete users[socket.id];
    delete user_roomid[socket.id];
    if (room in rooms) {
      rooms[room] = rooms[room].filter((id) => id.id !== socket.id);
    }
    // 방을 나가게 된다면 socketRoom과 users의 정보에서 해당 유저를 지워줍니다.
    // const roomID = [socket.id];

    // socket.broadcast.to(users[roomID]).emit("user_exit", { id: socket.id });
  });
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
