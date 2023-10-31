import React, { useContext, useEffect, useRef, useState } from "react";
import { socketCtx } from "../Room";
import { userMediaConfig } from "../../context/useSocket";
import Peer from "peerjs";
import User from "./User";
var getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;
const AudioChat = ({ roomid }) => {
  const socket = useContext(socketCtx);

  const peerRef = useRef(null);

  const [streams, setStreams] = useState([]);

  useEffect(() => {
    if (!socket) return;
    peerRef.current = new Peer(undefined);
    (async () => {
      try {
        await navigator.mediaDevices
          .getUserMedia(userMediaConfig)
          .then((stream) => {
            setStreams([{ stream, id: peerRef.current.id }]);
            socket.on("user-connected", (id, username) => {
              //새 유저 접속 시 기존 유저는 user-connected메세지를 받음
              connectToNewUser(id, stream, username);
              //나 자신(기존유저)와 새 유저의 피어 연결
            });

            peerRef.current.on("call", (call) => {
              //기존 유저에게 전화걸기
              getUserMedia(userMediaConfig, function (stream) {
                //전화를 걸어버림
                call.answer(stream);

                call.on(
                  "stream",

                  function (remoteStream) {
                    //   기존 유저의 스트림 받기
                    setStreams((p) => [
                      ...p,
                      {
                        id: call.peer,
                        stream: remoteStream,
                      },
                    ]);
                  },
                  function (err) {
                    console.log(err);
                  }
                );
              });
            });

            peerRef.current.on("open", (id) => {
              socket.emit("join-room", roomid, id);
            });
          });
        socket.on("user-disconnected", (id) => {
          setStreams((p) => p.filter((st) => st.id !== id));
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [socket]);

  useEffect(() => {
    console.log(streams);
  }, [streams]);
  function connectToNewUser(userId, stream, username) {
    //전화 받기
    const call = peerRef.current.call(userId, stream);
    call.on("stream", (userVideoStream) => {
      //새로 접속한 유저의 스트림을 얻어옴

      //   if (usersRef.current[userId]) return;
      //   usersRef.current[userId] = stream;
      //   setstreamsFunc(userIbj);
      setStreams((p) => [...p, { stream: userVideoStream, id: userId }]);
    });
    call.on("close", () => {
      //접속 끊김
      console.log("closed!!");
      // const new_stream = streams.filter((str) => str.id !== call.peer);
      //   setFilterstreamFunc(call.peer);
      // setStreams((p) => p.filter((str) => str.id !== call.peer));
      //   비디오 삭제
    });
  }
  return (
    <div>
      {streams.map((st, idx) => (
        <User st={st} key={idx} />
      ))}
    </div>
  );
};

export default AudioChat;
