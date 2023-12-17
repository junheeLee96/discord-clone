import styled from "@emotion/styled";
import React from "react";
import { useSelector } from "react-redux";

import MicorPhonesSetup from "./microphones/MicorPhonesSetup";
import PeerSetup from "./peerSetup/PeerSetup";
const SetupContainer = () => {
  return (
    <SetupContainerStyle>
      <PeerSetup />
      <MicorPhonesSetup />
    </SetupContainerStyle>
  );
};

export default SetupContainer;

const SetupContainerStyle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgb(32, 32, 36);
  height: 100px;
`;
