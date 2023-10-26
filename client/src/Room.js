import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import Video from "./Video";

var getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;

const Room = () => {
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const myVideoRef = useRef(null);

  const { roomid } = useParams();
  const [streams, setStreams] = useState([]);
  const [msg, setMsg] = useState([]);

  useEffect(() => {
    //소켓 연결
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
          const new_streams = streams.filter((st) => st.id !== id);
          setStreams(new_streams);
        });

        socketRef.current.on("other-user-streaming-start", (id) => {
          console.log(id);
          connectToNewUser(id, stream, "username");
        });
      });

    socketRef.current.on("receive-message", (ms, id) => {
      //sender를 포함한 룸 유저 전체에게 메세지
      setMsg((p) => [...p, { message: ms, id }]);
    });

    //피어생성
    peerRef.current = new Peer(socketRef.current.id);

    peerRef.current.on("call", (call) => {
      //기존 유저에게 전화걸기
      getUserMedia(
        //전화를 걸어버림
        { video: true, audio: false },
        function (stream) {
          call.answer(stream);
          call.on("stream", function (remoteStream) {
            //기존에 잇던 사람듸 스트림을 받아옴
            setStreams((p) => [...p, { stream: remoteStream, id: call.peer }]);
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

  function connectToNewUser(userId, streams, username) {
    //전화 받기

    const call = peerRef.current.call(userId, streams);
    call.on("stream", (userVideoStream) => {
      //새로 접속한 유저의 스트림을 얻어옴
      setStreams((p) => [...p, { stream: userVideoStream, id: userId }]);
    });
    call.on("close", () => {
      //접속 끊김
      console.log("closed!!");
      setStreams((p) => p.filter((str) => str.id !== call.peer));
      //   비디오 삭제
    });
  }
  const displayMediaOptions = {
    video: {
      cursor: "always",
      height: 500,
      width: 500,
    },
    audio: false,
  };

  const streamingPeerRef = useRef();
  const streamingVideoRef = useRef(null);
  const inputRef = useRef(null);

  const onSharingStart = async () => {
    // event.stopPropagation();
    try {
      await navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions)
        .then((stream) => {
          streamingVideoRef.current.srcObject = stream;
          streamingPeerRef.current = new Peer();

          streamingPeerRef.current.on("open", (id) => {
            socketRef.current.emit("streaming-start", roomid, id);
          });

          streamingPeerRef.current.on("call", (call) => {
            call.answer(stream);
          });
        });
    } catch (err) {
      // Handle error
      console.error("Error: " + err);
    }
  };

  // stop sharing

  const StopSharing = () => {
    streamingVideoRef.current.srcObject = null;
    // if (!streamingSocketRef.current) return;
    // if (!sharingVedioRef.current.srcObject) return;
    // let tracks = sharingVedioRef.current.srcObject.getTracks();
    // tracks.forEach((track) => track.stop());
    // sharingVedioRef.current.srcObject = null;
    // streamingPeerRef.current = null;
  };

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
      <button onClick={onSharingStart} id="start">
        SharingStart
      </button>
      <button onClick={StopSharing}>Stop sharing</button>
      <video autoPlay id="streaming" ref={streamingVideoRef} />
      <video ref={myVideoRef} autoPlay />
      {streams.map((st, idx) => (
        <Video st={st} key={idx} />
      ))}
    </div>
  );
};

export default Room;
