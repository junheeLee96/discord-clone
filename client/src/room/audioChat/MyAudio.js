import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGainNode from "../../context/audioCtx/gainNode/useGainNode";
import useAudioVol from "../../context/audioCtx/vol/useAudioVol";

const newArray = Array.from({ length: 40 }).map((_, i) => i);

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const MyAudio = ({ callRef }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const { socket } = useSelector((s) => s.socket);

  const [microVol, setMicroVol] = useState(1);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const myStream = useSelector((s) => s.stream.myStream);
  const peers = useSelector((s) => s.peers.peers);
  const { gainNode } = useGainNode({ stream: myStream?.stream, audioCtx });
  const { vol } = useAudioVol({
    stream: myStream?.stream,
    audioCtx,
    microVol,
  });

  // useEffect(() => {
  //   if (!myStream) return;
  //   const { stream } = myStream;
  //   const videoTracks = stream.getVideoTracks();
  //   console.log(videoTracks);

  //   const mediaStreamSource = audioCtx.createMediaStreamSource(stream);
  //   const mediaStreamDestination = audioCtx.createMediaStreamDestination();
  //   const gainNode = audioCtx.createGain();

  //   mediaStreamSource.connect(gainNode);
  //   gainNode.connect(mediaStreamDestination);

  //   gainNode.gain.value = microVol;

  //   const controlledStream = mediaStreamDestination.stream;

  //   for (const videoTrack of videoTracks) {
  //     controlledStream.addTrack(videoTrack);
  //   }

  //   ref.current.srcObject = controlledStream;
  //   dispatch(setmystream(controlledStream));
  // }, [microVol]);

  useEffect(() => {
    if (!gainNode) return;
    console.log(gainNode);
    gainNode.gain.value = 0;
    // console.log(gainNode.gain.value);
  }, [gainNode]);

  useEffect(() => {
    if (!myStream) return;
    // console.log(myStream);
    // const audioElement = new Audio();
    // const { stream } = enabledTrack({ stream: myStream.stream });

    // stream
    //   .getAudioTracks()
    //   .forEach((track) => (track.enabled = !track.enabled));
    // ref.current.defaultMuted = true;
    ref.current.muted = true;
    ref.current.srcObject = myStream.stream;
    // audioElement.srcObject = myStream.stream; // 여기서 stream은 자신의 오디오 스트림입니다.
    // audioElement.play().catch(function (error) {
    //   console.error("오디오를 재생할 수 없습니다: " + error);
    // });
  }, [myStream]);
  function replaceStream(peerConnection, mediaStream) {
    for (let sender of peerConnection.getSenders()) {
      if (sender.track.kind == "audio") {
        if (mediaStream.getAudioTracks().length > 0) {
          sender.replaceTrack(mediaStream.getAudioTracks()[0]);
        }
      }
      if (sender.track.kind == "video") {
        if (mediaStream.getVideoTracks().length > 0) {
          console.log(mediaStream.getVideoTracks());
          sender.replaceTrack(mediaStream.getVideoTracks()[0]);
        }
      }
    }
  }

  useEffect(() => {
    if (!myStream || !myStream.stream) return;
    // console.log(myStream.stream.getTracks());
    // window.addEventListener('addtrack')
  }, [myStream]);

  const onC = () => {
    // const { stream } = myStream;
    // if (!callRef.current) return;

    // myStream.stream.getVideoTracks()[0].enabled =
    //   !myStream.stream.getVideoTracks()[0].enabled;
    if (isVideoOn) {
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            noiseSuppression: true,
            echoCancellation: true,
            autoGainControl: true, // 자동 게인 제어
          },
          video: false,
        })
        .then((stream) => {
          // myStream.stream.removeTrack(myStream.stream.getVideoTracks()[0]);
          myStream.stream.getTracks().forEach((track) => {
            if (track.kind === "video") {
              track.stop();
              myStream.stream.removeTrack(track);
              ref.current.srcObject = myStream.stream;
            }
          });
        });
      // myStream.stream.removeTrack(myStream.stream.getVideoTracks()[0]);
    } else if (!isVideoOn) {
      // console.log(myPeer);
      // const localStream=
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          // audio: true,
        })
        .then(async (stream) => {
          // console.log(stream.getTracks());
          // return;
          const videoTrack = stream.getVideoTracks();

          for (const video of videoTrack) {
            myStream.stream.addTrack(video);
            Object.values(peers).forEach((peer) => {
              const { peerConnection } = peer;
              peerConnection.addTrack(video, myStream.stream);
            });
          }
          socket.emit("zz");
          // await myStream.stream.addTrack(videoTrack, myStream.stream);

          // Object.values(peers).forEach((peer) => {
          //   myStream.stream.getTracks().forEach((track) => {
          //     if (track.kind !== "audio") {
          //       peer.peerConnection.addTrack(track, myStream.stream);
          //     }
          //   });
          // });
        });
      //     stream.getTracks().forEach((track) => {
      //       peerConnection.addTrack(track, myStream.stream);
      //     });
      // peerConnection.addTrack(stream.getVideoTracks()[0], myStream.stream);
      // for (const track of stream.getTracks()) {
      //   if (track.kind === "video") {
      //     peerConnection.addTrack(track, myStream.stream);
      //     console.log(peerConnection.getSenders());
      //   }
      // }
      // myStream.strea = stream;
      // }
      // );
    }
    // console.log(
    //   callRef.current ? callRef.current.peerConnection.getSenders() : null
    // );
    setIsVideoOn((p) => !p);
    return;
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        const { peerConnection } = callRef.current;
        console.log(stream.getTracks());
        console.log(peerConnection.getSenders());
        replaceStream(peerConnection, stream);
        // peerConnection.getSenders() =stream.getTracks() ;
        // peerConnection.getSenders().replaceTrack(stream.getTracks());
        return;
        peerConnection.getSenders().forEach((sender, idx) => {
          if (
            // idx === 0 &&
            // sender.track.kind === "audio" &&
            stream.getAudioTracks().length > 0
          ) {
            // sender.removeTrack(stream.getAudioTracks()[0]);
            // sender.addTrack(stream.getAudioTracks()[0]);
            sender.replaceTrack(stream.getAudioTracks()[0]);
          }
          if (
            // sender.track.kind === "video" &&
            stream.getVideoTracks().length > 0
          ) {
            // sender.removeTrack(stream.getVideoTracks()[0]);
            // sender.addTrack(stream.getVideoTracks()[0]);
            console.log(sender);
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });

        // ref.current.srcObject = myStream.stream;
        // console.log(callRef.current.peerConnection.getSenders());
      });

    // console.log(peerConnection);
    // navigator.mediaDevices
    //   .getDisplayMedia({ video: true, audio: true })
    // .then((stream) => {});
  };

  const zz = () => {
    console.log(myStream.stream.getVideoTracks());
    // console.log(callRef.current.peerConnection.getSenders());
  };

  return (
    <div>
      <button onClick={onC}>{isVideoOn ? "video off" : "video on"}</button>
      <button onClick={zz}>show video track</button>
      {/* <div id="micro-vol">
        <button onClick={() => setMicroVol((p) => p + 1)}>UP</button>
        <div>MicroVol = {microVol}</div>
        <button onClick={() => setMicroVol((prev) => prev - 1)}>DOWN</button>
      </div> */}
      <div id="volume">
        {newArray.map((idx) => (
          <span
            key={idx}
            style={{
              display: "inline-block",
              width: "25px",
              height: "15px",
              background: vol >= idx ? "red" : "gray",
              margin: "5px",
            }}
          ></span>
        ))}
      </div>
      <video ref={ref} autoPlay />
    </div>
  );
};

export default MyAudio;
