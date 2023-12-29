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
  const { myStream, myId } = useSelector((s) => s.myStream);
  const [stream, setStream] = useState(null);
  const [vol, setVol] = useState(1);
  useEffect(() => {
    if (!myStream) return;
    ref.current.srcObject = myStream;
    setStream(myStream);
  }, [myStream]);

  useEffect(() => {
    if (!stream) return;
    ref.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    if (!myStream || !myId) return;

    console.log(myStream, myId);
    const stream = myStream;
    const videoTracks = stream.getVideoTracks();
    const context = new AudioContext();
    const mediaStreamSource = context.createMediaStreamSource(stream);
    const mediaStreamDestination = context.createMediaStreamDestination();
    const gainNode = context.createGain();
    mediaStreamSource.connect(gainNode);
    gainNode.connect(mediaStreamDestination);

    gainNode.gain.value = vol;
    // console.log(gainNode);
    //   gainNode.gain.setValueAtTime(0, context.currentTime + 1);
    const controlledStream = mediaStreamDestination.stream;
    for (const videoTrack of videoTracks) {
      controlledStream.addTrack(videoTrack);
    }
    ref.current.srcObject = controlledStream;
  }, [vol]);
  return (
    <UserStyle
      style={{
        background: `rgb(${myBackgroundColor})`,
      }}
    >
      <button onClick={() => setVol(Number((vol + 0.1).toFixed(1)))}>up</button>
      <div>{vol}</div>
      <button onClick={() => setVol(Number((vol - 0.1).toFixed(1)))}>
        dow
      </button>
      <VideoStyle ref={ref} autoPlay muted={false} />
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
