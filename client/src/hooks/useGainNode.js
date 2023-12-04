import React, { useEffect, useState } from "react";
import getGainNode from "../context/audioCtx/gainNode/getGainNode";

const useGainNode = ({ stream }) => {
  const [gainNode, setGainNode] = useState(null);
  useEffect(() => {
    if (!stream) return;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const { gainNode } = getGainNode(stream, audioCtx);
    // gainNode.gain.value = microVol;
    if (!gainNode) return;

    setGainNode(gainNode);
  }, [stream]);

  return { gainNode };
};

export default useGainNode;
