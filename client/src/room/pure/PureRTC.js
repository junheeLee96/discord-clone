import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const Video = ({ stream }) => {
  const ref = useRef();
  useEffect(() => {
    console.log(stream);
    ref.current.srcObject = stream;
  }, [stream]);
  return (
    <div>
      <video ref={ref} autoPlay />
    </div>
  );
};

const PureRTC = () => {
  const myRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const otherUserRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [peers, setPeers] = useState([]);

  const roomId = "123123";

  useEffect(() => {
    console.log(users);
  }, [users]);

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

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const id = socket.id;
      console.log("my id = ", id);
      const audio = stream.getAudioTracks()[0];
      audio.enabled = false;
      myRef.current.srcObject = stream;
      peerRef.current.addStream(stream);

      function addEvent(peer, sender) {
        peer.addEventListener("icecandidate", (data) => {
          console.log("ice data = ", data);
          socket.emit("ice", data.candidate, sender);
        });
        peer.addEventListener("track", (event) => {
          console.log("treack.stream = ", event.stream);
          // console.log(event.streams[0]);
          const stream = event.streams[0];
          if (!stream) return;

          console.log(stream);
          otherUserRef.current.srcObject = stream;
          stream.getTracks().forEach((track) => {
            track.addEventListener("ended", () => {
              console.log("end!!");
            });
          });
          // otherUserRef.current.srcObject = data.streams[0];
        });
      }
      socket.emit("join-room", roomId, id);

      socket.on("offs", async (offer, sender) => {
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });

        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        await peer.setRemoteDescription(offer);

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answers", answer, sender);

        socket.on("icezz", (ice) => {
          console.log("ice", ice);
          peer.addIceCandidate(ice);
        });
        addEvent(peer, sender);
      });
      //
      //

      socket.on("new_user_connected", async (receiver) => {
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });

        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        const offer = await peer.createOffer();

        await peer.setLocalDescription(offer);

        socket.emit("offs", offer, receiver, id);

        socket.on("answers", async (answer) => {
          await peer.setRemoteDescription(answer);
          socket.on("icezz", async (ice) => {
            console.log("ice = ", ice);
            peer.addIceCandidate(ice);
          });
        });
        addEvent(peer, receiver);
      });

      // socket.on("new_user_conn", async (new_user) => {
      //   console.log("new_user = ", new_user);
      //   const peer = new RTCPeerConnection({
      //     iceServers: [
      //       {
      //         urls: "stun:stun.l.google.com:19302",
      //       },
      //     ],
      //   });
      //   addEvent(peer, new_user);
      //   stream.getTracks().forEach((track) => {
      //     peer.addTrack(track, stream);
      //   });

      //   const offer = await peer.createOffer();
      //   await peer.setLocalDescription(offer);

      //   socket.emit("off", offer, id, new_user);

      //   socket.on("ans", async (answer, sender) => {
      //     peer.setRemoteDescription(answer);
      //   });
      //   socket.on("ice", (ice) => {
      //     peer.addIceCandidate(ice);
      //   });
      // });
      // //
      // //
      // socket.on("off", async (offer, sender) => {
      //   const peer = new RTCPeerConnection({
      //     iceServers: [
      //       {
      //         urls: "stun:stun.l.google.com:19302",
      //       },
      //     ],
      //   });
      //   stream.getTracks().forEach((track) => {
      //     peer.addTrack(track, stream);
      //   });
      //   peer.setRemoteDescription(offer);
      //   const answer = await peer.createAnswer();
      //   await peer.setLocalDescription(answer);
      //   socket.emit("ans", id, sender, answer);
      //   addEvent(peer, sender);
      //   socket.on("ice", (ice) => {
      //     peer.addIceCandidate(ice);
      //   });
      // });

      socket.on("welcom", async () => {
        const offer = await peerRef.current.createOffer();
        // console.log("offer = ", offer);
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
        console.log("izzz");
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
    });
    // .catch((error) => {
    //   console.error("Error accessing media devices.", error);
    // });
  }, []);

  return (
    <div>
      <video ref={myRef} autoPlay />
      {/* {o && <video srcObject={o} autoPlay />} */}
      <video ref={otherUserRef} autoPlay />
      {/* {users.map((st) => (
        <Video stream={st} />
      ))} */}
    </div>
  );
};

export default PureRTC;
