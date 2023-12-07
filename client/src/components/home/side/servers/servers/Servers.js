import React from "react";
import styled from "@emotion/styled";
import { ChannelIconStyle } from "../ServerContainer";
const Servers = () => {
  return (
    <ServersStyle>
      <ChannelIconStyle className="server">즐거운생활</ChannelIconStyle>
    </ServersStyle>
  );
};

export default Servers;

const ServersStyle = styled.div`
  color: white;

  .server {
    overflow: hidden;
  }
`;
