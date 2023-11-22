import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const PureRTC = () => {
  const myRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const otherUserRef = useRef(null);
  const [users, setUsers] = useState([]);

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
        const id = stream.id;
        const audio = stream.getAudioTracks()[0];
        audio.enabled = false;
        myRef.current.srcObject = stream;
        peerRef.current.addStream(stream);
        // stream.getTracks().forEach((track) => {
        //   peerRef.current.addTrack(track, stream);
        // });
        socket.emit("join-room", roomId);
        socket.on("welcom", async () => {
          const offer = await peerRef.current.createOffer();
          console.log("offer = ", offer);
          peerRef.current.setLocalDescription(offer);

          socket.emit("offer", offer, roomId, id);
        });

        socket.on("offer", async (offer, id) => {
          peerRef.current.setRemoteDescription(offer);
          const answer = await peerRef.current.createAnswer();
          await peerRef.current.setLocalDescription(answer);
          socket.emit("answer", answer, roomId);
        });

        socket.on("ice", (ice) => {
          peerRef.current.addIceCandidate(ice);
        });

        socket.on("answer", (answer) => {
          // peerRef.current.setLocalDescription(answer);
          peerRef.current.setRemoteDescription(answer);
        });

        peerRef.current.addEventListener("icecandidate", (data) => {
          // console.log("ice data = ", data);
          socket.emit("ice", data.candidate, roomId);
        });

        peerRef.current.addEventListener("track", (event) => {
          const stream = event.streams[0] || new MediaStream([event.track]);
          console.log(peerRef.current);
          otherUserRef.current.srcObject = stream;
          stream.getTracks().forEach((track) => {
            track.addEventListener("ended", () => {});
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
