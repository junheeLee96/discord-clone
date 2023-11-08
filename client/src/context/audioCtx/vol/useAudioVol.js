import React, { useEffect, useState } from "react";
import audioContext from "../audioContext";
import audioFrequency from "./audioFrequency";
import { userMediaConfig } from "../../useSocket";
import analyserCtx from "./analyser";

const useAudioVol = ({ stream, audioCtx, microVol }) => {
  const [vol, setVol] = useState(0);

  useEffect(() => {
    if (!stream) return;
    // console.log(stream.getAudioTracks());

    // if (st.stream.getAudioTracks().length <= 0) return;
    // if (userMediaConfig.audio === false) return;

    let analyserInterval;
    const { analyser, bufferLength, dataArray } = analyserCtx(stream, audioCtx);
    analyserInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const vol = audioFrequency(dataArray, bufferLength);
      setVol(Math.floor((vol / 256) * 100));
    }, 30);

    return () => clearInterval(analyserInterval);
  }, [stream]);

  return { vol };
};

export default useAudioVol;
