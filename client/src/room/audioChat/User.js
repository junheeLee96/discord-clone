import React, { useEffect, useRef, useState } from "react";
import useAudioVol from "../../context/audioCtx/vol/useAudioVol";
import useGainNode from "../../context/audioCtx/gainNode/useGainNode";
import { useSelector } from "react-redux";
const min = 0;
const max = 2;

const User = ({ st }) => {
  const peers = useSelector((s) => s.peers.peers);
  const ref = useRef();
  // const { vol } = useAudioVol({ st });
  // const { gainNode } = useGainNode({ stream: st.stream });
  const [userVol, setUserVol] = useState(1);
  // console.log(st.stream.getTracks());
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

    // ref.current.addEventListener("track", (s) => console.log(s));

    const peer = peers[st.id];
    console.log(st);
    // console.log(st);
    ref.current.srcObject = st.stream;

    // peer.peerConnection.ontrack((e) => console.log(e));

    // console.log(peer);

    const peerConnection = new RTCPeerConnection();
    peerConnection.addEventListener("track", async (event) => {
      // console.log(event);
      // const [remoteStream] = event.streams;
      // remoteVideo.srcObject = remoteStream;
    });

    // peer.peerConnection.addEventListener("track", (s) => console.log(s));
  }, [st]);

  const onVolChange = (vol) => {
    if (min <= vol && vol <= max) {
      setUserVol(vol);
    }
  };

  const onzz = () => {
    console.log(st.stream.getTracks());
  };
  return (
    <div style={{ position: "relative", marginTop: "20px" }}>
      <button onClick={onzz}>스트림 트랙 확인</button>
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
