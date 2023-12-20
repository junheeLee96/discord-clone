import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { background_arr } from "../User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

export const myBackgroundColor =
  background_arr[Math.floor(Math.random() * background_arr.length)];

const MyVideo = () => {
  const ref = useRef(null);
  const { myStream, id } = useSelector((s) => s.myStream);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (!myStream) return;
    ref.current.srcObject = myStream;
    // setStream(myStream);
  }, [myStream]);

  useEffect(() => {
    if (!stream) return;
    ref.current.srcObject = stream;
  }, [stream]);
  return (
    <UserStyle
      style={{
        background: `rgb(${myBackgroundColor})`,
      }}
    >
      <VideoStyle ref={ref} />
      <FontAwesomeIcon
        icon={faDiscord}
        style={{ position: "absolute", fontSize: "30px" }}
      />
    </UserStyle>
  );
};

export default MyVideo;

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
