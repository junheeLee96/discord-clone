import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import Video from "../Video";
import useSocket from "../context/useSocket";
import Stream from "./Stream";
import Chat from "./Chat";
import audioContext from "../audioContext";
import audioFrequency from "../audioFrequency";
import AudioChat from "./audioChat/AudioChat";

var getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;

export const socketCtx = createContext();
const Room = () => {
  // const socketRef = useRef(null);
  // const peerRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const myVideoRef = useRef(null);

  const { roomid } = useParams();
  const [streams, setStreams] = useState([]);
  const stRef = useRef([]);
  const [msg, setMsg] = useState([]);

  // const { socketRef, vol } = useSocket({
  //   // connectToNewUser,
  //   setstreamsFunc, //유저들 변경 함수
  //   myVideoRef, //내 화면 (비디오) ref
  //   streams, //유저들 배열
  //   roomid, //룸 아이디
  //   setMgsFunc, //메세지 변경 함수
  //   setFilterstreamFunc, //유저들 나가면 발생되는, 나간 유저 핉터함수
  // });

  // function setMgsFunc(ms, id) {
  //   setMsg((p) => [...p, { message: ms, id }]);
  // }
  // function setstreamsFunc(st) {
  //   console.log(st);
  //   setStreams((p) => [...p, st]);
  //   // stRef.current = [...stRef.current, st];
  // }
  // function setFilterstreamFunc(id) {
  //   const arr = streams.filter((st) => st.id !== id);
  //   const arr2 = stRef.current.filter((st) => st.id !== id);
  //   // stRef.current = [...stRef.current, ];
  //   // stRef.current = [...arr2];
  //   setStreams(arr);
  // }

  useEffect(() => {
    const socket = io.connect("http://localhost:9000");
    setSocket(socket);
  }, []);

  return (
    <div>
      <socketCtx.Provider value={socket}>
        <AudioChat roomid={roomid} />
        {/* {socketRef && <Stream roomid={roomid} socketRef={socketRef} />}
        {socketRef && <Chat socketRef={socketRef} roomid={roomid} msg={msg} />}
        <video ref={myVideoRef} autoPlay />
        {streams.map((st, idx) => (
          <Video st={st} key={idx} />
        ))} */}
      </socketCtx.Provider>
    </div>
  );
};

export default Room;
