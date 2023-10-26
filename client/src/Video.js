import React, { useEffect, useRef } from "react";

const Video = ({ st }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current.srcObject = st.stream;
  });
  return <video autoPlay ref={ref} />;
};

export default Video;
