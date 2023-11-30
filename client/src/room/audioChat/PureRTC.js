import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const Video = ({ stream }) => {
  const ref = useRef();
  useEffect(() => {
    if (!stream) return;
    console.log(stream.stream);
    console.log(stream.stream.getTracks());
    ref.current.srcObject = stream.stream;
  }, [stream]);
  return <video ref={ref} autoPlay />;
};

const PureRTC = () => {
  const myRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const otherUserRef = useRef(null);
  const idRef = useRef(null);
  const [users, setUsers] = useState({});
  // const [peers, setPeers] = useState({});
  const peers = useRef({});

  const roomId = "123123";

  useEffect(() => {
    console.log(users);
  }, [users]);
  useEffect(() => {
    const socket = io("localhost:8080");
    socketRef.current = socket;

    const constraints = {
      video: true,
      audio: true,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const id = socket.id;
      idRef.current = id;
      const audio = stream.getAudioTracks()[0];
      audio.enabled = false;
      myRef.current.srcObject = stream;
      console.log("my id = ", id);
      function eventing(peer, user) {
        peer.addEventListener("icecandidate", (data) => {
          socket.emit("candidate", data.candidate, user, id);
        });
        peer.addEventListener("track", (e) => {
          const stream = e.streams[0];

          setUsers((p) => {
            return { ...p, [user]: { stream } };
          });
        });
      }
      socket.emit("join-room", roomId, id);
      socket.on("origin_users", async (users) => {
        // for (const user of users) {
        users.forEach(async (user) => {
          if (user !== id) {
            console.log(user);
            const peer = new RTCPeerConnection({
              iceServers: [
                {
                  urls: "stun:stun.l.google.com:19302",
                },
              ],
            });
            peers.current[user] = { ...peers.current[user], peer };
            await peers.current[user].peer.addStream(stream);
            eventing(peers.current[user].peer, user);
            const offer = await peers.current[user].peer.createOffer();
            peers.current[user].peer.setLocalDescription(offer);
            console.log(peers.current[user].peer.signalingState);
            socket.emit("send_off", offer, id, user);
          }
          // }
        });
      });

      // socket.emit("join-room", roomId, id);

      socket.on("send_ans", async (answer, sender) => {
        if ("have-local-offer" === peers.current[sender].peer.signalingState) {
          try {
            await peers.current[sender].peer.setRemoteDescription(answer);
          } catch (err) {
            console.error("err!!", err);
          }
        } else {
          console.log("have no local offer");
        }
      });
      socket.on("candidate", async (ice, sender) => {
        console.log(ice);
        peers.current[sender].peer.addIceCandidate(ice);
      });
      socket.on("send_off", async (offer, new_user) => {
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });
        peer.addStream(stream);
        peers.current[new_user] = { ...peers.current[new_user], peer };
        peers.current[new_user].peer.addEventListener("icecandidate", (e) => {
          socket.emit("candidate", e.candidate, new_user, id);
        });
        peers.current[new_user].peer.addEventListener("track", (e) => {
          const stream = e.streams[0];

          setUsers((p) => {
            return { ...p, [new_user]: { stream } };
          });
        });
        await peers.current[new_user].peer.setRemoteDescription(offer);
        const answer = await peers.current[new_user].peer.createAnswer();
        peers.current[new_user].peer.setLocalDescription(answer);
        socket.emit("send_ans", answer, id, new_user);
      });

      // 새 유저로부터 SDP제안 수신
    });
  }, []);

  return (
    <div>
      <video ref={myRef} autoPlay />
      {Object.keys(users).length > 0 &&
        Object.keys(users).map((key, idx) => (
          <Video stream={users[key]} key={idx} />
        ))}
    </div>
  );
};

export default PureRTC;
