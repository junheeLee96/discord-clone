import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import InputRange from "../../../../../../custom/InputRange";
const min = 0;
const max = 100;
const step = 0.1;

const ControlMicroPhoneVol = ({ handleMicrophoneSetup }) => {
  const [vol, setVol] = useState(1);
  const ref = useRef();
  const { myStream, myId } = useSelector((s) => s.myStream);
  const [copyStream, setCopyStream] = useState(null);
  const [pid, setPid] = useState(0);

  function handleVolChange(number) {
    setVol(number);
  }

  function analyser(stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    scriptProcessor.onaudioprocess = function () {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      const arraySum = array.reduce((a, value) => a + value, 0);
      const average = arraySum / array.length;
      const v = Math.round(average);
      // console.log(v);
      setPid(v);
      //   setPid(Math.round(average));
      // colorPids(average);
    };
  }
  useEffect(() => {
    if (!myStream || !myId || !copyStream) return;

    console.log(myStream, myId);
    const stream = copyStream;
    const videoTracks = stream.getVideoTracks();
    const context = new AudioContext();
    // const audioContext = context;
    const mediaStreamSource = context.createMediaStreamSource(stream);
    const mediaStreamDestination = context.createMediaStreamDestination();
    const gainNode = context.createGain();
    mediaStreamSource.connect(gainNode);
    gainNode.connect(mediaStreamDestination);

    gainNode.gain.value = vol;
    // console.log(gainNode);
    //   gainNode.gain.setValueAtTime(0, context.currentTime + 1);
    const controlledStream = mediaStreamDestination.stream;
    for (const videoTrack of videoTracks) {
      controlledStream.addTrack(videoTrack);
    }

    // analyser(context, controlledStream);
    setCopyStream(controlledStream);

    // ref.current.srcObject = controlledStream;
  }, [vol]);

  useEffect(() => {
    if (!copyStream) return;
    ref.current.srcObject = copyStream;
  }, [copyStream]);

  useEffect(() => {
    analyser(myStream);
    setCopyStream(myStream);
  }, [myStream]);
  console.log(vol);
  return (
    <ControlMicroPhoneVolStyle>
      <PopupStyle>
        <h3>음성설정</h3>
        <div style={{ width: "200px", display: "flex", margin: "50px 0" }}>
          <InputRange
            min={min}
            step={step}
            value={vol}
            max={max}
            onChange={handleVolChange}
          />
          <div style={{ margin: "0 20px" }}>{vol * 100}</div>
        </div>
        {/* <button onClick={() => setVol(Number((vol + 0.1).toFixed(1)))}>
          up
        </button>
        <div>{vol}</div>
        <button onClick={() => setVol(Number((vol - 0.1).toFixed(1)))}>
          dow
        </button> */}
        <div>MicroPhone</div>
        <PidsWrapper>
          {new Array(50).fill(0).map((n, idx) => (
            <VolsStyle
              key={idx}
              style={{
                background: pid >= idx ? "rgb(70,193,48)" : "rgb(72, 76, 84)",
              }}
            ></VolsStyle>
          ))}
        </PidsWrapper>
        <audio ref={ref} autoPlay />
      </PopupStyle>
      <div className="bg" onClick={() => handleMicrophoneSetup()} />
    </ControlMicroPhoneVolStyle>
  );
};

export default ControlMicroPhoneVol;

const ControlMicroPhoneVolStyle = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;

  justify-content: center;
  .bg {
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.3;
    position: relative;
    z-index: 2;
    position: absolute;
  }
`;

const PopupStyle = styled.div`
  width: 90%;
  height: 90%;
  position: relative;
  z-index: 3;
  background: rgb(43, 45, 49);
  padding: 20px;
`;

const VolsStyle = styled.div`
  width: 20px;
  height: 10px;
  border: 1px solid black;
`;

const PidsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
