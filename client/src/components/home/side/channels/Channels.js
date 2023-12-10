import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeLow } from "@fortawesome/free-solid-svg-icons";
const Channels = () => {
  return (
    <ChannelsStyle>
      <FontAwesomeIcon icon={faVolumeLow} />
      <ChannelStyle>ㅎㅇㅎㅇ</ChannelStyle>
    </ChannelsStyle>
  );
};

export default Channels;

const ChannelsStyle = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  padding-left: 8px;
  align-items: center;
  cursor: pointer;
`;

const ChannelStyle = styled.div`
  width: 100%;
  padding-left: 10px;
`;
