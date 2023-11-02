import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import audioFrequency from "./audioCtx/audioFrequency";
// import audioContext from "./audioCtx/audioContext";
var getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;
export const userMediaConfig = {
  video: true,
  audio: true,
};
const useSocket = ({
  myVideoRef,
  // connectToNewUser,
  setstreamsFunc,
  setMgsFunc,
  roomid,
  setFilterstreamFunc,
}) => {
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const usersRef = useRef({});
  const [vol, setVol] = useState(1);
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:9000");

    navigator.mediaDevices.getUserMedia(userMediaConfig).then((stream) => {
      //내 스트림데이터(비디오, 오디오)를 가져와서 비디오 태그에 연결
      audioVolume(stream);
      myVideoRef.current.srcObject = stream;
      socketRef.current.on("user-connected", (id, username) => {
        //새 유저 접속 시 기존 유저는 user-connected메세지를 받음
        connectToNewUser(id, stream, username);
        //나 자신(기존유저)와 새 유저의 피어 연결
      });

      socketRef.current.on("user-disconnected", (id) => {
        // const new_streams = streams.filter((st) => st.id !== id);
        //   setStreams(new_streams);
        delete usersRef.current[id];
        setFilterstreamFunc(id);
      });

      socketRef.current.on("other-ser-streaming-start", (id) => {
        connectToNewUser(id, stream, "username");
      });
    });

    socketRef.current.on("receive-message", (ms, id) => {
      //sender를 포함한 룸 유저 전체에게 메세지
      setMgsFunc(ms, id);
      //   setMsg((p) => [...p, { message: ms, id }]);
    });

    // 피어생성;
    peerRef.current = new Peer();

    peerRef.current.on("call", (call) => {
      //기존 유저에게 전화걸기
      console.log("call = ", call);
      getUserMedia(
        //전화를 걸어버림
        userMediaConfig,
        function (stream) {
          call.answer(stream);
          call.on("stream", function (remoteStream) {
            if (usersRef.current[call.peer]) {
              return;
            }
            usersRef.current[call.peer] = remoteStream;
            //기존에 잇던 사람듸 스트림을 받아옴
            // const new_stream = [
            //   ...streams,
            //   { stream: remoteStream, id: call.peer },
            // ];
            setstreamsFunc({
              called: "peer on call",
              stream: remoteStream,
              id: call.peer,
            });
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
      console.log("내 피어 id = ", id);
      socketRef.current.emit("join-room", roomid, id);
    });

    return () => {
      socketRef.current.off("receive-message");
      socketRef.current.off("other-user-streaming-start");
      socketRef.current.off("user-disconnected");
      socketRef.current.off("user-connected");
    };
  }, []);

  function connectToNewUser(userId, stream, username) {
    //전화 받기
    const call = peerRef.current.call(userId, stream);
    call.on("stream", (userVideoStream) => {
      console.log(userId);

      //새로 접속한 유저의 스트림을 얻어옴
      const userIbj = {
        stream: userVideoStream,
        id: userId,
      };
      if (usersRef.current[userId]) return;
      usersRef.current[userId] = stream;
      setstreamsFunc(userIbj);
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

  function audioVolume(stream) {
    if (!userMediaConfig.audio) return;
    let analyserInterval;
    // const { analyser, bufferLength, dataArray } = audioContext(stream);  console.log(stream);
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256; // 256 ~ 2048
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    // return { analyser, bufferLength, dataArray };
    analyserInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const vol = audioFrequency(dataArray, bufferLength);
      setVol(Math.floor((vol / 256) * 100));
    }, 30);

    return () => clearInterval(analyserInterval);
  }

  return { socketRef, peerRef, vol };
};

export default useSocket;
