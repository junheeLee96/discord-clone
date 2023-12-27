import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { useSelector } from "react-redux";
export const background_arr = [
  "105, 113, 127",
  "39,155,85",
  "255,157,44",
  "234,51,156",
];

const User = ({ stream, peer, user_id }) => {
  const ref = useRef();
  const vol = useSelector((s) => s.peers.peers[user_id].volume);

  useEffect(() => {
    if (!stream || !stream) return;
    if (!stream.stream) return;
    ref.current.srcObject = stream.stream;
    // if (stream.stream.getTracks()) console.log(stream.stream.getTracks());
  }, [stream]);

  useEffect(() => {
    if (!ref.current) return;
    if (isNaN(vol)) return;
    ref.current.volume = parseFloat(vol);
  }, [vol]);
  return (
    <UserStyle
      style={{
        background: `rgb(${
          background_arr[Math.floor(Math.random() * background_arr.length)]
        })`,
      }}
    >
      <VideoStyle ref={ref} autoPlay muted={true} />
      <FontAwesomeIcon
        icon={faDiscord}
        style={{ position: "absolute", fontSize: "30px" }}
      />
    </UserStyle>
  );
};

export default User;

const UserStyle = styled.div`
  width: 200px;
  aspect-ratio: 1/0.7500187504687617;
  margin: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
`;

const VideoStyle = styled.video`
  width: 100% !important;
  height: 100% !important;
`;
