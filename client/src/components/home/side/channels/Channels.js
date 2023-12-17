import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeLow } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import ChannelUser from "./channelUsers/ChannelUser";
const Channels = () => {
  const { peers } = useSelector((s) => s.peers);
  const { myStream, myId, nickname } = useSelector((s) => s.myStream);
  console.log(nickname);
  console.log(peers);
  return (
    <ChannelsStyle>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FontAwesomeIcon icon={faVolumeLow} />
        <ChannelStyle>ㅎㅇㅎㅇ</ChannelStyle>
      </div>
      {nickname && (
        <ChannelUser nickname={nickname} stream={myStream} id={myId} />
      )}

      {Object.keys(peers).length > 0 &&
        Object.keys(peers).map((key, idx) => (
          <ChannelUser
            stream={peers[key].stream}
            key={idx}
            nickname={peers[key].nickname}
            id={key}
            peer={peers[key].peer}
          />
        ))}
    </ChannelsStyle>
  );
};

export default Channels;

const ChannelsStyle = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  padding-left: 8px;
  cursor: pointer;
  flex-direction: column;
`;

const ChannelStyle = styled.div`
  width: 100%;
  padding-left: 10px;
  font-weight: 500;
`;
