import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const Video = ({ stream }) => {
  const ref = useRef();
  useEffect(() => {
    // console.log(stream);
    ref.current.srcObject = stream.stream;
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
  const idRef = useRef(null);
  const [users, setUsers] = useState({});
  const [peers, setPeers] = useState({});

  const roomId = "123123";

  useEffect(() => {
    // console.log(users);
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
      idRef.current = id;
      console.log("my id = ", id);
      const audio = stream.getAudioTracks()[0];
      audio.enabled = false;
      myRef.current.srcObject = stream;
      peerRef.current.addStream(stream);
      let answers = [];
      let ices = [];

      async function addEvent(peer, sender) {
        peer.addEventListener("icecandidate", (data) => {
          console.log("ice!!addeventlistener");
          socket.emit("ice", data.candidate, sender);
        });

        peer.addEventListener("track", (event) => {
          // console.log(event.streams[0]);
          console.log("track!!");
          const stream = event.streams[0];
          setUsers((p) => {
            console.log(p);
            return {
              ...p,
              [sender]: {
                stream,
                peer,
              },
            };
          });
          if (!stream) return;
        });

        // peer.addEventListener("onconnectionstatechange", () => {
        //   console.log("Connection State:", peer.connectionState);

        //   if (peer.connectionState === "disconnected") {
        //     // 피어의 연결이 끊어졌을 때 처리할 로직을 여기에 추가
        //     console.log("Peer connection disconnected!");
        //     setUsers((p) => {
        //       return delete p[sender];
        //     });
        //   }
        // });
      }
      let current_peer;
      const peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });

      console.log(peer);
      async function createOffer(user) {
        console.log(user);
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });

        console.log(peer);
        peer.addStream(stream);
        addEvent(peer, user);
        const offer = await peer.createOffer();
        peer.setLocalDescription(offer);
        console.log("ananana");
        socket.emit("send_offer", offer, user, id);

        socket.on("send_answer", async (answer) => {
          console.log("answer = ", answer);
          if (answers.includes(JSON.stringify(answer))) {
            return;
          }
          console.log(peer);
          answers.push(JSON.stringify(answer));
          await peer.setRemoteDescription(answer);
        });
        socket.on("icezz", (ice) => {
          if (ices.includes(JSON.stringify(ice))) {
            return;
          }
          console.log(peer);
          ices.push(JSON.stringify(ice));
          peer.addIceCandidate(ice);
        });
      }

      socket.emit("join-room", roomId, id);

      socket.on("origin_users", (users) => {
        console.log(users);

        users.forEach(async (user) => {
          if (user !== id) {
            // createOffer(user);
            const peer = new RTCPeerConnection({
              iceServers: [
                {
                  urls: "stun:stun.l.google.com:19302",
                },
              ],
            });

            console.log(peer);
            peer.addStream(stream);
            addEvent(peer, user);
            const offer = await peer.createOffer();
            peer.setLocalDescription(offer);
            console.log("ananana");
            socket.emit("send_offer", offer, user, id);

            socket.on(`send_answer${user}`, async (answer) => {
              console.log("answer = ", answer);
              // if (answers.includes(JSON.stringify(answer))) {
              //   return;
              // }
              console.log(peer);
              answers.push(JSON.stringify(answer));
              await peer.setRemoteDescription(answer);
            });
            socket.on(`icezz${user}`, (ice) => {
              // if (ices.includes(JSON.stringify(ice))) {
              //   return;
              // }
              console.log(peer);
              ices.push(JSON.stringify(ice));
              peer.addIceCandidate(ice);
            });
          }
        });
      });

      socket.on("send_offer", async (offer, sender) => {
        console.log("sned offer");
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });
        peer.addStream(stream);
        // addEvent(peer, sender);
        peer.addEventListener("icecandidate", (data) => {
          console.log("ice!!addeventlistener");
          socket.emit("ice", data.candidate, sender, id);
        });

        peer.addEventListener("track", (event) => {
          // console.log(event.streams[0]);
          console.log("track!!");
          const stream = event.streams[0];
          setUsers((p) => {
            console.log(p);
            return {
              ...p,
              [sender]: {
                stream,
                peer,
              },
            };
          });
          if (!stream) return;
        });
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        console.log("answer = ", answer);
        peer.setLocalDescription(answer);
        socket.emit("send_answer", answer, sender, id);
        socket.on("icezz", (ice) => {
          console.log(ice);
          peer.addIceCandidate(ice);
        });
      });

      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      // socket.on("offs", async (offer, sender) => {
      //   return;
      //   console.log("offs = ", offer);
      //   const peer = new RTCPeerConnection({
      //     iceServers: [
      //       {
      //         urls: "stun:stun.l.google.com:19302",
      //       },
      //     ],
      //   });
      //   addEvent(peer, sender);

      //   // stream.getTracks().forEach((track) => {
      //   //   peer.addTrack(track, stream);
      //   // });
      //   peer.addStream(stream);
      //   await peer.setRemoteDescription(offer);

      //   const answer = await peer.createAnswer();
      //   await peer.setLocalDescription(answer);
      //   socket.emit("answers", answer, sender);

      //   socket.on("icezz", (ice) => {
      //     peer.addIceCandidate(ice);
      //   });
      // });
      // //
      // //

      // socket.on("new_user_connected", async (receiver) => {
      //   const peer = new RTCPeerConnection({
      //     iceServers: [
      //       {
      //         urls: "stun:stun.l.google.com:19302",
      //       },
      //     ],
      //   });

      //   // stream.getTracks().forEach((track) => {
      //   //   peer.addTrack(track, stream);
      //   // });
      //   peer.addStream(stream);

      //   const offer = await peer.createOffer();
      //   console.log(offer);

      //   await peer.setLocalDescription(offer);

      //   socket.emit("offs", offer, receiver, id);

      //   socket.on("answers", async (answer) => {
      //     await peer.setRemoteDescription(answer);
      //   });
      //   addEvent(peer, receiver);
      //   socket.on("icezz", async (ice) => {
      //     peer.addIceCandidate(ice);
      //   });
      // });

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

      // socket.on("welcom", async () => {
      //   const offer = await peerRef.current.createOffer();
      //   // console.log("offer = ", offer);
      //   peerRef.current.setLocalDescription(offer);

      //   socket.emit("offer", offer, roomId, id);
      // });

      // socket.on("offer", async (offer, id) => {
      //   peerRef.current.setRemoteDescription(offer);
      //   const answer = await peerRef.current.createAnswer();
      //   await peerRef.current.setLocalDescription(answer);
      //   socket.emit("answer", answer, roomId);
      // });

      // socket.on("ice", (ice) => {
      //   peerRef.current.addIceCandidate(ice);
      // });

      // socket.on("answer", (answer) => {
      //   // peerRef.current.setLocalDescription(answer);
      //   peerRef.current.setRemoteDescription(answer);
      // });

      // peerRef.current.addEventListener("icecandidate", (data) => {
      //   // console.log("ice data = ", data);
      //   console.log("izzz");
      //   socket.emit("ice", data.candidate, roomId);
      // });

      // peerRef.current.addEventListener("track", (event) => {
      //   const stream = event.streams[0] || new MediaStream([event.track]);
      //   console.log(peerRef.current);
      //   otherUserRef.current.srcObject = stream;
      //   stream.getTracks().forEach((track) => {
      //     track.addEventListener("ended", () => {});
      //   });
      //   // otherUserRef.current.srcObject = data.streams[0];
      // });
    });
    // .catch((error) => {
    //   console.error("Error accessing media devices.", error);
    // });

    // socket.on("disconn", (dis) => {
    //   console.log(dis);
    //   setUsers((p) => {
    //     return delete p[dis];
    //   });
    // });
  }, []);

  return (
    <div>
      <video ref={myRef} autoPlay />
      {/* {o && <video srcObject={o} autoPlay />} */}
      <video ref={otherUserRef} autoPlay />
      {Object.keys(users).map((key, idx) => (
        <Video stream={users[key]} key={idx} />
      ))}
    </div>
  );
};

export default PureRTC;
