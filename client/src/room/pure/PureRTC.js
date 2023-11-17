import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const PureRTC = () => {
  const myRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const otherUserRef = useRef(null);
  const roomId = "123123";
  useEffect(() => {
    const socket = io("localhost:8080");
    socketRef.current = socket;

    // iceServers는 stun sever설정
    peerRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    const constraints = {
      video: true,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log("Got MediaStream:", stream);
        const audio = stream.getAudioTracks()[0];
        audio.enabled = false;
        myRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          peerRef.current.addTrack(track, stream);
        });
        socket.emit("join-room", roomId);
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    socket.on("welcom", async (user, newCount) => {
      const offer = await peerRef.current.createOffer();
      peerRef.current.setLocalDescription(offer);
      socket.emit("offer", offer, roomId);
    });

    socket.on("offer", async (offer) => {
      peerRef.current.setRemoteDescription(offer);
      const answer = await peerRef.current.createAnswer();
      peerRef.current.setLocalDescription(answer);
      socket.emit("answer", answer, peerRef.current);
    });

    socket.on("ice", (ice) => {
      peerRef.current.addIceCandidate(ice);
    });

    socket.on("answer", (answer) => {
      peerRef.current.setRemoteDescription(answer);
    });

    socket.on("bye", (left, newCount) => {
      console.log(left, newCount);
    });

    peerRef.current.addEventListener("icecandiate", (data) => {
      socket.emit("ice", data.candidate, roomId);
    });

    peerRef.current.addEventListener("addstream", (data) => {
      otherUserRef.current.srcObject = data.stream;
    });
  }, []);
  return (
    <div>
      <video ref={myRef} autoPlay />
      <video ref={otherUserRef} autoPlay />
    </div>
  );
};

export default PureRTC;
