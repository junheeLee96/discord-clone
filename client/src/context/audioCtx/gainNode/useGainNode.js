import React, { useEffect, useState } from "react";
import getGainNode from "./getGainNode";

const useGainNode = ({ stream, audioCtx }) => {
  const [gainNode, setGainNode] = useState(0);
  useEffect(() => {
    // setGainNode(node)
    if (!stream || audioCtx) return;

    const { gainNode } = getGainNode(stream, audioCtx);

    if (!gainNode) return;

    setGainNode(gainNode);
  }, [stream]);
  return { gainNode };
};

export default useGainNode;
