import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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

    // socket.emit("zz", roomId);
    // socket.on("zzzzzz", () => {
    //   console.log("ewqewqewqzzzzz");
    // });

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
        socket.on("welcom", async (user, newCount) => {
          console.log("welcom");
          const offer = await peerRef.current.createOffer();
          peerRef.current.setLocalDescription(offer);
          console.log("보내는 오퍼 = ", offer);
          socket.emit("offer", offer, roomId);
        });

        socket.on("offer", async (offer) => {
          console.log("받는오퍼 = ", offer);
          peerRef.current.setRemoteDescription(offer);
          const answer = await peerRef.current.createAnswer();
          console.log("보내는 answer = ", answer);
          await peerRef.current.setLocalDescription(answer);
          socket.emit("answer", answer, roomId);
        });

        socket.on("ice", (ice) => {
          peerRef.current.addIceCandidate(ice);
        });

        socket.on("answer", (answer) => {
          console.log("받은 answer = ", answer);
          // peerRef.current.setLocalDescription(answer);
          peerRef.current.setRemoteDescription(answer);
        });

        peerRef.current.addEventListener("icecandidate", (data) => {
          // console.log("ice data = ", data);
          socket.emit("ice", data.candidate, roomId);
        });

        peerRef.current.addEventListener("track", (event) => {
          console.log("addstream data = ", event);
          const stream = event.streams[0] || new MediaStream([event.track]);
          console.log("stream = ", stream);

          otherUserRef.current.srcObject = stream;
          console.log("stream.getTracks() = ", stream.getTracks());
          stream.getTracks().forEach((track) => {
            track.addEventListener("ended", () => {
              console.log("Track ended:", track);
            });
          });
          // otherUserRef.current.srcObject = data.streams[0];
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  }, []);

  return (
    <div>
      <video ref={myRef} autoPlay />
      {/* {o && <video srcObject={o} autoPlay />} */}
      <video ref={otherUserRef} autoPlay />
    </div>
  );
};

export default PureRTC;
