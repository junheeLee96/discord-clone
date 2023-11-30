import React, { useEffect, useRef } from "react";

const MySquare = ({ stream }) => {
  const ref = useRef();

  useEffect(() => {
    if (!stream || !stream) return;
    ref.current.srcObject = stream;
  }, [stream]);
  return (
    <div>
      <video ref={ref} autoPlay />
    </div>
  );
};

export default MySquare;
