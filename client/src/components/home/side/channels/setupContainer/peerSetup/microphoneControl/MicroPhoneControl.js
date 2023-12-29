import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MicroPhoneControl = () => {
  const { myStream, myId } = useSelector((s) => s.myStream);
  const [vol, setVol] = useState(1);

  useEffect(() => {
    //     if (!myStream || !myId) return;
    //     console.log(myStream, myId);
    //     const stream = myStream;
    //  const videoTracks = stream.getVideoTracks();
    //     const context = new AudioContext();
    //     const mediaStreamSource = context.createMediaStreamSource(stream);
    //     const mediaStreamDestination = context.createMediaStreamDestination();
    //     const gainNode = context.createGain();
    //     mediaStreamSource.connect(gainNode);
    //     gainNode.connect(mediaStreamDestination);
    //     gainNode.gain.value = 0;
    //     // console.log(gainNode);
    //     //   gainNode.gain.setValueAtTime(0, context.currentTime + 1);
    //        const controlledStream = mediaStreamDestination.stream;
    //        for (const videoTrack of videoTracks) {
    //          controlledStream.addTrack(videoTrack);
    //        }
  }, [vol]);
  return (
    <div>
      <button onClick={() => setVol(Number((vol + 0.1).toFixed(1)))}>up</button>
      <div>{vol}</div>
      <button onClick={() => setVol(Number((vol - 0.1).toFixed(1)))}>
        dow
      </button>
    </div>
  );
};

export default MicroPhoneControl;
