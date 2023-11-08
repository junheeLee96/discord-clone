import React, { useEffect, useRef, useState } from "react";
import useAudioVol from "../../context/audioCtx/vol/useAudioVol";
import useGainNode from "../../context/audioCtx/gainNode/useGainNode";
const min = 0;
const max = 2;

const User = ({ st }) => {
  const ref = useRef();
  // const { vol } = useAudioVol({ st });
  // const { gainNode } = useGainNode({ stream: st.stream });
  const [userVol, setUserVol] = useState(1);
  // const { vol } = useAudioVol({ stream: st.stream });
  // useEffect(() => {
  //   console.log(vol);
  // }, [vol]);
  // useEffect(() => {
  //   if (!gainNode) return;
  //   gainNode.gain.value = userVol;
  // }, [userVol]);

  useEffect(() => {
    if (!st) return;
    // const { stream } = enabledTrack({ stream: st.stream });
    ref.current.srcObject = st.stream;
  }, [st]);

  const onVolChange = (vol) => {
    if (min <= vol && vol <= max) {
      setUserVol(vol);
    }
  };
  return (
    <div style={{ position: "relative", marginTop: "20px" }}>
      <div
        className="cont-vol"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <div>
          <button onClick={() => onVolChange(userVol + 0.1)}>vol + 0.1</button>
        </div>
        {userVol}
        <div>
          <button onClick={() => onVolChange(userVol - 0.1)}>vol - 0.1</button>
        </div>
      </div>
      {st && (
        <div style={{ position: "relative" }}>
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
        </div>
      )}
      <video autoPlay ref={ref} />
    </div>
  );
};

export default User;
