import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";

const background_arr = ["105, 113, 127", "39,155,85", "255,157,44"];

const User = ({ stream, peer, user_id }) => {
  const ref = useRef();
  useEffect(() => {
    if (!stream || !stream) return;
    if (!stream.stream) return;
    ref.current.srcObject = stream.stream;
    console.log(stream);
    // if (stream.stream.getTracks()) console.log(stream.stream.getTracks());
  }, [stream]);
  return (
    <UserStyle
      style={{
        background: `rgb(${
          background_arr[Math.floor(Math.random() * background_arr.length)]
        })`,
      }}
    >
      <VideoStyle ref={ref} autoPlay muted={true} />
    </UserStyle>
  );
};

export default User;

const UserStyle = styled.div`
  width: 200px;
  aspect-ratio: 1/0.7500187504687617;
`;

const VideoStyle = styled.video`
  width: 100% !important;
  height: 100% !important;
`;
