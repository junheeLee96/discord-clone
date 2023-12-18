import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneFlip, faDisplay } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const PeerSetup = () => {
  const navigate = useNavigate();
  const { myStream, myId, socket } = useSelector((s) => s.myStream);
  console.log(myId);
  const handleVideoTrack = () => {};

  const leaveRoom = () => {
    socket.emit("leaveRoom", myId);
    navigate("/");
  };

  return (
    <PeerSetupStyle>
      <FontAwesomeIcon
        onClick={handleVideoTrack}
        icon={faDisplay}
        style={{
          cursor: "pointer",
          color: "rgb(172, 177, 185) !important",
        }}
      />
      <CallDisconnectStyle
        onClick={leaveRoom}
        icon={faPhoneFlip}
        style={{
          cursor: "pointer",
        }}
      />
    </PeerSetupStyle>
  );
};

export default PeerSetup;

const PeerSetupStyle = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
  border-bottom: 1px solid rgb(66, 66, 75);
`;

const CallDisconnectStyle = styled(FontAwesomeIcon)`
  color: rgb(172, 177, 185) !important;
  &:hover {
    color: red;
  }
`;
