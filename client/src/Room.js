import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const Room = () => {
  const socketRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:9000");

    socketRef.current.emit("join-room");

    peerRef.current = new Peer();

    peerRef.current.on("open", (id) => {
      //data connection
      console.log(id);
    });
  }, []);

  return <div></div>;
};

export default Room;
