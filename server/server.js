const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = 9000;

io.on("connection", (socket) => {
  console.log("connection!!");

  socket.on("join-room", (roomid, id, nickname) => {
    socket.join(roomid);
    // console.log("new_user,id = ", id);
    //new user join to the room

    //sender를 제외한 방의 모든 사람에게 메세지를 날림
    socket.broadcast.to(roomid).emit("user-connected", id, nickname);
    socket.on("disconnect", () => {
      //유저의 소켓연결이 끊어졌을때

      socket.leave(roomid);
      //방에서 내보내고

      //모두에게 알린다
      socket.to(roomid).emit("user-disconnected", id);
    });

    socket.on("streaming-start", (roomid, id) => {
      console.log(roomid);
      console.log("streaming id = ", id);
      //sender 빼고 모든 룸안의 유저들에게 메세지를 날림
      socket.broadcast.to(roomid).emit("streamer-start", id);
    });

    socket.on("message-send", (ms, id, roomid) => {
      //sender를 포함한 룸 유저 전체에게 메세지
      io.in(roomid).emit("receive-message", ms, id);
    });
  });
});

server.listen(PORT, () => console.log("server is running on ", PORT));
