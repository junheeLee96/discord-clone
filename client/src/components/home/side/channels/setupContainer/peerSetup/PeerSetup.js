import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneFlip, faDisplay } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { setmystream } from "../../../../../../modules/myStream";
const PeerSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVideoOn, setIsVideoOn] = useState(false);

  const { myStream, myId, socket } = useSelector((s) => s.myStream);
  const peers = useSelector((s) => s.peers.peers);

  const leaveRoom = () => {
    socket.emit("leaveRoom", myId);
    navigate("/");
  };

  function renegotiate(condition) {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: condition })
      .then((stream) => {
        dispatch(setmystream(stream));
        Object.keys(peers).forEach(async (key) => {
          peers[key].peer.addStream(stream);
          const offer = await peers[key].peer.createOffer();
          peers[key].peer.setLocalDescription(offer);
          socket.emit("renegotiate_offer", offer, myId, key);
        });
        setIsVideoOn(condition);
      });
  }
  const handleVideoTrack = () => {
    if (isVideoOn) {
      renegotiate(false);
      // navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      //   dispatch(setmystream(stream));
      //   Object.keys(peers).forEach(async (key) => {
      //     peers[key].peer.addStream(stream);
      //     const offer = await peers[key].peer.createOffer();
      //     peers[key].peer.setLocalDescription(offer);
      //     socket.emit("renegotiate_offer", offer, myId, key);
      //   });

      // });
      // setIsVideoOn(false);
    } else {
      renegotiate(true);
      // navigator.mediaDevices
      //   .getUserMedia({ video: true, audio: true })
      //   .then((stream) => {
      //     dispatch(setmystream(stream));
      //     Object.keys(peers).forEach(async (key) => {
      //       peers[key].peer.addStream(stream);
      //       const offer = await peers[key].peer.createOffer();
      //       peers[key].peer.setLocalDescription(offer);
      //       socket.emit("renegotiate_offer", offer, myId, key);
      //     });

      //   });
      // setIsVideoOn(true);
    }
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
