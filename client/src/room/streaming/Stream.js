import React, { useEffect, useRef } from "react";

const Stream = ({ st }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.srcObject = st.stream;
  }, [st]);
  return (
    <div>
      <video autoPlay ref={ref} />
    </div>
  );
};

export default Stream;
