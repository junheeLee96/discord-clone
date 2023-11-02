import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserMedia } from "../Room";
import {
  setdisplaystreams,
  setfilterdisplaystreams,
  setmydisplaystream,
} from "../../modules/displayStream";
import Peer from "peerjs";
import User from "../audioChat/User";

const mynickname = "nick";

const StreamBtns = ({ roomid }) => {
  const socket = useSelector((s) => s.socket.socket);
  const [peer, setPeer] = useState(null);

  const dispatch = useDispatch();
  const myStream = useSelector((s) => s.stream.myStream?.stream);
  const displayStreams = useSelector((s) => s.displayStream.displayStreams);
  const myDisplayStream = useSelector((s) => s.displayStream.myDisplayStream);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    if (!myStream) return;
    const peer = new Peer();
    setPeer(peer);

    socket.on("streamer-start", (id) => {
      connectToNewUser(peer, id, myStream, mynickname);
    });

    socket.on("streaming-disconnect", (id) => {
      dispatch(setfilterdisplaystreams({ id }));
    });
  }, [myStream]);

  const stop = () => {
    if (!myDisplayStream) return;
    dispatch(setmydisplaystream({ isStop: true }));
    setIsStart(false);
    socket.emit("streaming-disconnect", peer.id);
  };

  const start = () => {
    if (!socket) return;
    setIsStart(true);

    try {
      navigator.mediaDevices.getDisplayMedia(getUserMedia).then((stream) => {
        dispatch(
          setmydisplaystream({ id: peer.id, nickname: mynickname, stream })
        );
        socket.emit("streaming-start", roomid, peer.id);

        peer.on("call", (call) => {
          console.log(call);
          call.answer(stream);
          call.on("stream", (s) => console.log(s));
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  function connectToNewUser(peer, userId, stream, username) {
    //전화 받기
    // return;
    const call = peer.call(userId, myStream);
    // console.log(peer.call(userId, stream));
    call.on("stream", (userDisplayStream) => {
      // console.log(call.peer);
      dispatch(
        setdisplaystreams({
          id: call.peer,
          stream: userDisplayStream,
          nickname: "123",
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
      <button onClick={() => start()}>strart</button>
      <button onClick={() => stop()}>stop</button>
      {/* {isStart && socket && <MyDisplayStreaming roomid={roomid} />} */}
      {displayStreams.map((st, idx) => (
        <User st={st} key={idx} />
      ))}
    </div>
  );
};

export default StreamBtns;
