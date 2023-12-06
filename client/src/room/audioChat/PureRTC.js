import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import UserSquare from "./UserSquare";
import MySquare from "./MySquare";
import { setpeers } from "../../modules/peers";
import { setsocket } from "../../modules/socket";

export const Video = ({ stream }) => {
  const ref = useRef();
  useEffect(() => {
    if (!stream) return;
    ref.current.srcObject = stream.stream;
  }, [stream]);
  return <video ref={ref} autoPlay />;
};

const PureRTC = () => {
  const dispatch = useDispatch();

  const socketRef = useRef(null);
  const idRef = useRef(null);
  const [MyVideo, setMyVideo] = useState(null);
  // const [users, setUsers] = useState({});
  const users = useSelector((s) => s.peers.peers);
  // const [peers, setPeers] = useState({});
  const peers = useRef({});

  const roomId = "123123";

  useEffect(() => {
    const socket = io("localhost:8080");
    socketRef.current = socket;
    dispatch(setsocket(socket));

    const constraints = {
      video: true,
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: true, // 자동 게인 제어}
      },
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const id = socket.id;
      console.log("my id = ", id);
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioContext = audioCtx;
      // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.5;
      var gainConnected = source.connect(gainNode);
      gainConnected.connect(audioContext.destination);
      gainNode.gain.value = 0;
      idRef.current = id;
      // const audio = stream.getAudioTracks()[0];
      // audio.enabled = false;
      setMyVideo(stream);
      function eventing(peer, user) {
        peer.addEventListener("icecandidate", (data) => {
          socket.emit("candidate", data.candidate, user, id);
        });
        peer.addEventListener("track", (e) => {
          const stream = e.streams[0];
          dispatch(setpeers({ peer, userId: user, stream }));
          // setUsers((p) => {
          //   return { ...p, [user]: { stream } };
          // });
        });
      }
      socket.emit("join-room", roomId, id);
      socket.on("origin_users", async (users) => {
        // for (const user of users) {
        users.forEach(async (user) => {
          // 방에있는 모든 유저
          if (user !== id) {
            // 피어생성
            const peer = new RTCPeerConnection({
              iceServers: [
                {
                  urls: "stun:stun.l.google.com:19302", //구글 무료 스턴서버
                },
              ],
            });
            // useRef에 유저와 피어 추가
            peers.current[user] = { ...peers.current[user], peer };
            // 스트림 추가
            await peers.current[user].peer.addStream(stream);
            // addEventlistener
            eventing(peers.current[user].peer, user);
            // 오퍼 생성
            const offer = await peers.current[user].peer.createOffer();
            peers.current[user].peer.setLocalDescription(offer);
            socket.emit("send_off", offer, id, user);
          }
          // }
        });
      });

      // socket.emit("join-room", roomId, id);

      socket.on("send_ans", async (answer, sender) => {
        // 시그널링 상태가 stable이 될 수 있으므로
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
        // ice 후보 교환
        peers.current[sender].peer.addIceCandidate(ice);
      });
      socket.on("send_off", async (offer, new_user) => {
        // 오퍼를 받음.
        // 피어 생성
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });
        // 스트림 추가
        peer.addStream(stream);

        peers.current[new_user] = { ...peers.current[new_user], peer };
        peers.current[new_user].peer.addEventListener("icecandidate", (e) => {
          socket.emit("candidate", e.candidate, new_user, id);
        });
        peers.current[new_user].peer.addEventListener("track", (e) => {
          const stream = e.streams[0];

          dispatch(setpeers({ peer, userId: new_user, stream }));
          // setUsers((p) => {
          //   return { ...p, [new_user]: { stream } };
          // });
        });
        // offer 추가
        await peers.current[new_user].peer.setRemoteDescription(offer);
        // answer 생성
        const answer = await peers.current[new_user].peer.createAnswer();
        peers.current[new_user].peer.setLocalDescription(answer);
        socket.emit("send_ans", answer, id, new_user);
      });

      // 새 유저로부터 SDP제안 수신
    });
  }, []);

  console.log(users);

  return (
    <div>
      <MySquare stream={MyVideo} />
      {Object.keys(users).length > 0 &&
        Object.keys(users).map((key, idx) => (
          <UserSquare
            stream={users[key]}
            peer={peers[key]}
            key={idx}
            user_id={key}
          />
        ))}
    </div>
  );
};

export default PureRTC;
