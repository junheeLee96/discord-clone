import React from "react";
import styled from "@emotion/styled";
import ChannelName from "./ChannelName";
import Channels from "./Channels";
const ChannelContainer = () => {
  return (
    <ChannelContainerStyle>
      <ChannelName />
      <LineDivStyle />
      <Channels />
    </ChannelContainerStyle>
  );
};

export default ChannelContainer;

const ChannelContainerStyle = styled.div`
  flex: 1;
  height: 100%;
  background: green;
`;

const LineDivStyle = styled.div`
  width: 100%;
  height: 2px;
  margin-bottom: 10px;
  background: rgb(43, 45, 49);
`;
