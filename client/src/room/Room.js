import React, { createContext } from "react";
import { useParams } from "react-router-dom";

import AudioChat from "./audioChat/AudioChat";
import StreamBtns from "./streaming/StreamBtns";
import PureRTC from "./pure/PureRTC";
import VideoCall from "./pure/VideoCall";
import RoomComponent from "./pure/RoomComponent";

export const getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;

export const socketCtx = createContext();
export const streamCtx = createContext();
const Room = () => {
  const { roomid } = useParams();

  return (
    <div>
      {/* <RoomComponent /> */}
      <PureRTC />
      {/* <VideoCall /> */}
      {/* <StreamBtns roomid={roomid} />
      <AudioChat roomid={roomid} /> */}
    </div>
  );
};

export default Room;
