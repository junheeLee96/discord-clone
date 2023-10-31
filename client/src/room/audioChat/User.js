import React, { useEffect, useRef } from "react";

const User = ({ st }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current.srcObject = st.stream;
  }, st);
  return (
    <div>
      <video autoPlay ref={ref} />
    </div>
  );
};

export default User;
