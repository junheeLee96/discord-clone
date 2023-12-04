import React, { useEffect, useRef, useState } from "react";
import useAudioVol from "../../hooks/useAudioVol";
import useGainNode from "../../context/audioCtx/gainNode/useGainNode";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const MySquare = ({ stream }) => {
  const ref = useRef();
  // const [vol, setVol] = useState(1);

  // const { gainNode } = useGainNode({ stream, audioCtx });
  const [microVol, setMicroVol] = useState(1);
  const { vol } = useAudioVol({
    //현재 내 볼륨 가져오기
    stream,
  });

  // useEffect(() => {
  //   console.log(gainNode);
  //   if (gainNode) {
  //     gainNode.gain.value = 0;
  //   }
  // }, [gainNode]);
  // useEffect(() => {
  //   if (!gainNode) return;
  //   gainNode.gain.value = microVol;
  //   console.log(gainNode.gain.value);
  // }, [microVol]);

  // useEffect(() => {
  //   if (!gainNode) return;
  //   gainNode.gain.value = 0.0;
  //   console.log(gainNode);
  // }, [gainNode]);

  useEffect(() => {
    if (!stream || !stream) return;
    ref.current.srcObject = stream;
  }, [stream]);
  return (
    <div>
      <button
        onClick={() => {
          setMicroVol((p) => p + 0.1);
        }}
      >
        볼륨 업
      </button>
      <button
        onClick={() => {
          setMicroVol((p) => p - 0.1);
        }}
      >
        볼륨 업
      </button>
      <video ref={ref} autoPlay />
    </div>
  );
};

export default MySquare;
