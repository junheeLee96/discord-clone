import React, { useEffect, useRef } from "react";

const UserSquare = ({ stream }) => {
  const ref = useRef();

  useEffect(() => {
    if (!stream || !stream) return;
    ref.current.srcObject = stream.stream;
  }, [stream]);
  return (
    <div style={{ width: "500px", height: "500px", border: "1px solid red" }}>
      <video ref={ref} autoPlay />
    </div>
  );
};

export default UserSquare;
