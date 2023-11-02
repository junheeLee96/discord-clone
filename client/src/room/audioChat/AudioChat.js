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
} from "../../modules/stream";

const nickname = "nickname";
var getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;
const AudioChat = ({ roomid }) => {
  const dispatch = useDispatch();
  // const socket = useContext(socketCtx);
  // const stream = useContext(streamCtx);

  const userStreams = useSelector((s) => s.stream.userStreams);

  useEffect(() => {
    const socket = io.connect("http://localhost:9000");
    const peer = new Peer(undefined);
    dispatch(setsocket(socket));
    try {
      navigator.mediaDevices.getUserMedia(userMediaConfig).then((stream) => {
        peer.on("open", (id) => {
          dispatch(setmystream({ stream, nickname, id: id }));
          socket.emit("join-room", roomid, id, nickname);
        });

        peer.on("call", (call) => {
          getUserMedia(userMediaConfig, (st) => {
            call.answer(st);
            call.on("stream", (remoteStream) => {
              dispatch(
                setuserstreams({
                  id: call.peer,
                  stream: remoteStream,
                  nickname: "123123",
                })
              );
            });
          });
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
    call.on("stream", (userVideoStream) => {
      //새로 접속한 유저의 스트림을 얻어옴
      dispatch(
        setuserstreams({
          id: userId,
          stream: userVideoStream,
          nickname: username,
        })
      );
    });
    call.on("close", () => {
      //접속 끊김
      console.log("closed!!");
      //   비디오 삭제
    });
  }

  return (
    <div>
      {userStreams.map((st, idx) => (
        <User st={st} key={idx} />
      ))}
    </div>
  );
};

export default AudioChat;
