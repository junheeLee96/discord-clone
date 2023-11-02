import React, { useEffect, useState } from "react";
import audioContext from "./audioContext";
import audioFrequency from "./audioFrequency";
import { userMediaConfig } from "../useSocket";

const useAudioVol = ({ st }) => {
  const [vol, setVol] = useState(0);

  useEffect(() => {
    if (!st) return;
    if (userMediaConfig.audio === false) return;
    const { stream } = st;
    let analyserInterval;
    const { analyser, bufferLength, dataArray } = audioContext(stream);
    analyserInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const vol = audioFrequency(dataArray, bufferLength);
      setVol(Math.floor((vol / 256) * 100));
    }, 30);

    return () => clearInterval(analyserInterval);
  }, [st]);

  return { vol };
};

export default useAudioVol;
