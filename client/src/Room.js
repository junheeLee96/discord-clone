import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import Video from "./Video";
import useSocket from "./context/useSocket";
import Stream from "./Stream";

var getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;

const Room = () => {
  // const socketRef = useRef(null);
  // const peerRef = useRef(null);
  const myVideoRef = useRef(null);

  const { roomid } = useParams();
  const [streams, setStreams] = useState([]);
  const stRef = useRef([]);
  const [msg, setMsg] = useState([]);

  function setMgsFunc(ms, id) {
    setMsg((p) => [...p, { message: ms, id }]);
  }
  function setstreamsFunc(st) {
    setStreams((p) => [...p, st]);
    stRef.current = [...stRef.current, st];
  }
  function setFilterstreamFunc(id) {
    console.log(streams);
    const arr = streams.filter((st) => st.id !== id);
    const arr2 = stRef.current.filter((st) => st.id !== id);
    // stRef.current = [...stRef.current, ];
    stRef.current = [...arr2];
    setStreams(arr);
  }

  const { socketRef } = useSocket({
    // connectToNewUser,
    setstreamsFunc,
    myVideoRef,
    streams,
    roomid,
    setMgsFunc,
    setFilterstreamFunc,
  });

  const inputRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();

    const { value } = inputRef.current;
    socketRef.current.emit("message-send", value, socketRef.current.id, roomid);
    inputRef.current.value = "";
  };

  return (
    <div>
      <div id="chat">
        <form onSubmit={onSubmit}>
          <label htmlFor="text">텍스트 입력 </label>
          <input type="text" id="text" ref={inputRef} />
        </form>

        <div>
          {msg.map((ms, idx) => (
            <div key={idx}>{ms.message}</div>
          ))}
        </div>
      </div>
      {socketRef && <Stream roomid={roomid} socketRef={socketRef} />}
      <video ref={myVideoRef} autoPlay />
      {stRef.current.map((st, idx) => (
        <Video st={st} key={idx} />
      ))}
    </div>
  );
};

export default Room;
