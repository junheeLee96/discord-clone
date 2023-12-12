import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";

const User = ({ stream, peer, user_id }) => {
  const ref = useRef();
  useEffect(() => {
    if (!stream || !stream) return;
    ref.current.srcObject = stream.stream;
  }, [stream]);
  return (
    <UserStyle>
      <VideoStyle ref={ref} autoPlay muted={true} />
    </UserStyle>
  );
};

export default User;

const UserStyle = styled.div`
  width: 300px;
  height: 300px;
`;

const VideoStyle = styled.video`
  width: 100% !important;
  height: 100% !important;
`;
