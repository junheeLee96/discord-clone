import styled from "@emotion/styled";
import React from "react";
import ServerContainer from "./servers/ServerContainer";
import ChannelContainer from "./channels/ChannelContainer";
const Side = () => {
  return (
    <SideStyle>
      <ServerContainer />
      <ChannelContainer />
    </SideStyle>
  );
};

export default Side;

const SideStyle = styled.div`
  width: 300px;
  height: 100%;
  display: flex;

  @media (max-width: 1000px) {
    display: none;
  }
`;
