import Peer from "peerjs";
import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
var getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;

const useSocket = ({
  myVideoRef,
  // connectToNewUser,
  setstreamsFunc,
  setMgsFunc,
  roomid,
  streams,
  setFilterstreamFunc,
}) => {
  const socketRef = useRef();
  const peerRef = useRef(null);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:9000");

    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        //내 스트림데이터(비디오, 오디오)를 가져와서 비디오 태그에 연결
        myVideoRef.current.srcObject = stream;

        socketRef.current.on("user-connected", (id, username) => {
          //새 유저 접속 시 기존 유저는 user-connected메세지를 받음
          connectToNewUser(id, stream, username);
          //나 자신(기존유저)와 새 유저의 피어 연결
        });

        socketRef.current.on("user-disconnected", (id) => {
          // const new_streams = streams.filter((st) => st.id !== id);
          //   setStreams(new_streams);

          setFilterstreamFunc(id);
        });

        socketRef.current.on("other-user-streaming-start", (id) => {
          console.log("other-user id = ", id);
          connectToNewUser(id, stream, "username");
        });
      });

    socketRef.current.on("receive-message", (ms, id) => {
      //sender를 포함한 룸 유저 전체에게 메세지
      setMgsFunc(ms, id);
      //   setMsg((p) => [...p, { message: ms, id }]);
    });

    socketRef.current.on("receive-message", (ms, id) => {
      //sender를 포함한 룸 유저 전체에게 메세지
      // setMsg((p) => [...p, { message: ms, id }]);
    });

    // 피어생성;
    peerRef.current = new Peer();

    peerRef.current.on("call", (call) => {
      //기존 유저에게 전화걸기
      getUserMedia(
        //전화를 걸어버림
        { video: true, audio: false },
        function (stream) {
          call.answer(stream);
          call.on("stream", function (remoteStream) {
            console.log(call.peer);
            //기존에 잇던 사람듸 스트림을 받아옴
            // const new_stream = [
            //   ...streams,
            //   { stream: remoteStream, id: call.peer },
            // ];
            setstreamsFunc({ stream: remoteStream, id: call.peer });
            // setStreams((p) => [...p, { stream: remoteStream, id: call.peer }]);
          });
        },
        function (err) {
          alert(err);
        }
      );
    });

    peerRef.current.on("open", (id) => {
      //피어 생성하면 기본적으로 실행됨
      console.log("음성피어 id = ", id);
      socketRef.current.emit("join-room", roomid, id);
    });
  }, []);

  function connectToNewUser(userId, stream, username) {
    console.log(streams);
    //전화 받기

    const call = peerRef.current.call(userId, stream);
    call.on("stream", (userVideoStream) => {
      //새로 접속한 유저의 스트림을 얻어옴

      // console.log(userId);
      // console.log(streams);
      // const new_streas = [...streams, { stream: userVideoStream, id: userId }];

      setstreamsFunc({ stream: userVideoStream, id: userId });
      // setStreams((p) => [...p, { stream: userVideoStream, id: userId }]);
    });
    call.on("close", () => {
      //접속 끊김
      console.log("closed!!");
      // const new_stream = streams.filter((str) => str.id !== call.peer);
      setFilterstreamFunc(call.peer);
      // setStreams((p) => p.filter((str) => str.id !== call.peer));
      //   비디오 삭제
    });
  }
  return { socketRef, peerRef };
};

export default useSocket;
