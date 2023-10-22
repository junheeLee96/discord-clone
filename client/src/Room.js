import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Room = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:9000");

    socketRef.current.emit("join-room");
  }, []);

  return <div></div>;
};

export default Room;
