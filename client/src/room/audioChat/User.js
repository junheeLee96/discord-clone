import React, { useEffect, useRef } from "react";
import useAudioVol from "../../context/audioCtx/useAudioVol";

const User = ({ st }) => {
  const ref = useRef();
  const { vol } = useAudioVol({ st });

  useEffect(() => {
    console.log(vol);
  }, [vol]);
  useEffect(() => {
    ref.current.srcObject = st.stream;
  }, [st]);
  return (
    <div style={{ position: "relative" }}>
      {st && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            color: "yellowgreen",
            fontSize: "40px",
          }}
        >
          {st.nickname}
        </div>
      )}
      <video autoPlay ref={ref} />
    </div>
  );
};

export default User;
