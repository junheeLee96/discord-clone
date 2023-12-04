import React, { useEffect, useState } from "react";
import audioContext from "../context/audioCtx/audioContext";
import audioFrequency from "../context/audioCtx/vol/audioFrequency";
import { userMediaConfig } from "../context/useSocket";
import analyserCtx from "../context/audioCtx/vol/analyser";

const useAudioVol = ({ stream, audioCtx }) => {
  const [vol, setVol] = useState(0);

  useEffect(() => {
    if (!stream) return;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
