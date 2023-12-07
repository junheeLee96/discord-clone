import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddChannel from "./defaults/AddChannel";
import SearchingChannel from "./defaults/SearchingChannel";
import AppDownload from "./defaults/AppDownload";
import Logo from "./logo/Logo";
import Servers from "./servers/Servers";

const ServerContainer = () => {
  return (
    <ServerContainerStyle>
      <Logo />
      <LineDivStyle />
      <Servers />
      <AddChannel />
      <SearchingChannel />
      <LineDivStyle />
      <AppDownload />
    </ServerContainerStyle>
  );
};

export default ServerContainer;

const ServerContainerStyle = styled.div`
  width: 72px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
  overflow: hidden scroll;
  background: rgb(28, 28, 31);
`;

export const FontAwesomeIconStyle = styled(FontAwesomeIcon)`
  color: green;
  font-size: 25px;
  transition: background 0.1s;
`;

export const ChannelIconStyle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  background: rgb(43, 45, 49);
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgb(20, 117, 64);
    svg {
      color: white;
    }
  }
`;

const LineDivStyle = styled.div`
  width: 48px;
  height: 2px;
  margin-bottom: 10px;
  background: rgb(43, 45, 49);
`;
