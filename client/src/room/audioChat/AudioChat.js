import React, { useContext, useEffect, useRef, useState } from "react";
import { socketCtx, streamCtx } from "../Room";
import { userMediaConfig } from "../../context/useSocket";
import Peer from "peerjs";
import User from "./User";
import { io } from "socket.io-client";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setsocket } from "../../modules/socket";
import {
  setfilteruserstreams,
  setmystream,
  setuserstreams,
  setuservideotrack,
} from "../../modules/stream";
import MyAudio from "./MyAudio";
import { setpeers } from "../../modules/peers";

const constraints = {
  audio: {
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true, // 자동 게인 제어
  },
  // video: true,
};

const nickname = "nickname";
var getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;
const AudioChat = ({ roomid }) => {
  const dispatch = useDispatch();

  const [micVol, setMicVol] = useState(1);
  const peers = useSelector((s) => s.peers.peers);
  const userStreams = useSelector((s) => s.stream.userStreams);
  // const myStream = useSelector((s) => s.stream.myStream);
  const callRef = useRef(null);
  const peerRef = useRef(null);
  // console.log(myStream);
  useEffect(() => {
    const socket = io.connect("http://localhost:9000");
    const peer = new Peer(undefined);
    peerRef.current = peer;
    dispatch(setsocket(socket));
    try {
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        // const videoTrack = stream.getVideoTracks()[0];
        // videoTrack.stop();
        // const videoTrack = stream.getVideoTracks()[0];
        // videoTrack.enabled = false;

        dispatch(
          setmystream({
            stream,
            nickname,
            id: peer.id,
            peer,
          })
        );
        // console.log(peer);

        peer.on("open", (id) => {
          console.log("내 피어 아이디 = ", id);
          // dispatch(setcall({ call: peer.call }));
          socket.emit("join-room", roomid, id, nickname);
        });

        peer.on("call", (call) => {
          // console.log(call.options);

          // ontrack 이벤트 핸들러 설정

          // call.on("track", (track) => console.log(track));
          dispatch(setpeers({ peer: call, userId: call.peer }));
          // console.log("calling....!!");
          // dispatch(setcall({ call }));
          // console.log(call);
          // console.log(call.peerConnection);
          // getUserMedia({ video: true, audio: true }, (st) => {
          // const videoTrack = st.getVideoTracks()[0];
          // videoTrack.enabled = false;
          const st = stream;
          // getUserMedia(constraints, (st) => {
          call.answer(st);
          console.log(call.peerConnection);
          call.peerConnection.onaddstream = function (e) {
            // console.log(e);
            const remotMediaStream = e.stream;
            console.log(remotMediaStream.getVideoTracks());
            if (remotMediaStream.length <= 1) {
              return;
            } else {
              console.log(remotMediaStream);
            }
          };
          // call.peerConnection.addEventListener("track", async (e) => {
          //   console.log(e);
          //   const [remoteStream] = e.streams;
          //   console.log("zzzzzz");
          //   dispatch(setuservideotrack({ remoteStream }));
          //   // console.log(userStreams, remoteStream);
          //   // console.log(remoteStream);
          // });
          call.on("stream", (remoteStream) => {
            dispatch(
              setuserstreams({
                id: call.peer,
                stream: remoteStream,
                nickname: "123123",
                peer,
              })
            );
          });
          // peer.peerConnection.ontrack((e) => console.log(e));
          // call.peerConnection.addEventListener("track", (e) => console.log(e));
          // });
        });

        socket.on("user-connected", (id, userNickname) => {
          connectToNewUser(peer, id, stream, userNickname);
        });
      });
    } catch (err) {
      console.log(err);
    }

    socket.on("user-disconnected", (id) => {
      dispatch(setfilteruserstreams({ id }));
    });
  }, []);

  function connectToNewUser(peer, userId, stream, username) {
    //전화 받기
    const call = peer.call(userId, stream);

    // call.peerConnection.addEventListener("track", (e) => console.log(e));
    dispatch(setpeers({ peer: call, userId: call.peer }));
    // callRef.current = call;
    call.peerConnection.onaddtrack = function (e) {
      console.log(e);
    };
    // call.peerConnection.addEventListener("track", (e) => {
    //   e.track.streams.getSe
    // });
    // console.log(call.peerConnection.getSenders());
    call.on("stream", (userVideoStream) => {
      //새로 접속한 유저의 스트림을 얻어옴
      dispatch(
        setuserstreams({
          id: userId,
          stream: userVideoStream,
          nickname: username,
          peer,
        })
      );
    });
    call.on("close", () => {
      //접속 끊김
      console.log("closed!!");
      //   비디오 삭제
    });
  }

  useEffect(() => {
    if (userStreams.length <= 0) return;
    console.log(userStreams);
    // console.log(userStreams[0].stream.getVideoTracks());
  }, [userStreams]);
  return (
    <div>
      <div>
        <button onClick={() => setMicVol((p) => p + 0.1)}>mic up</button>
        <div>mic vol = {micVol}</div>
        <button onClick={() => setMicVol((p) => p - 0.1)}>mic down</button>
      </div>
      <MyAudio callRef={callRef} />
      {userStreams.map((st, idx) => (
        <User st={st} key={idx} />
      ))}
    </div>
  );
};

export default AudioChat;
