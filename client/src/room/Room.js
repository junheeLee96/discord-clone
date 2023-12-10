import React, { createContext } from "react";
import { useParams } from "react-router-dom";

import AudioChat from "./audioChat/AudioChat";
import StreamBtns from "./streaming/StreamBtns";
import VideoCall from "./pure/VideoCall";
import RoomComponent from "./pure/RoomComponent";
import PureRTC from "./audioChat/PureRTC";
import styled from "@emotion/styled";
import UserBoxes from "./userBoxes/UserBoxes";

export const getUserMedia =
  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozG;

export const socketCtx = createContext();
export const streamCtx = createContext();
const Room = () => {
  const { roomid } = useParams();

  return (
    <RoomStyle>
      <UserBoxes />
      {/* <RoomComponent /> */}
      {/* <PureRTC /> */}
      {/* <VideoCall /> */}
      {/* <StreamBtns roomid={roomid} />
      <AudioChat roomid={roomid} /> */}
    </RoomStyle>
  );
};

export default Room;

const RoomStyle = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
  background: red;
`;
