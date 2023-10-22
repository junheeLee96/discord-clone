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

  socket.on("join-room", () => {
    console.log("join-rooom!!");
  });
});

server.listen(PORT, () => console.log("server is running on ", PORT));
