import styled from "@emotion/styled";
import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneFlip, faDisplay } from "@fortawesome/free-solid-svg-icons";
const PeerSetup = () => {
  const { myStream, myId } = useSelector((s) => s.myStream);

  const handleVideoTrack = () => {};
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
      <FontAwesomeIcon
        icon={faPhoneFlip}
        style={{
          cursor: "pointer",
          color: "rgb(172, 177, 185) !important",
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
