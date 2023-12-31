import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setdisconnect, setnickname, setpeers } from "../../modules/peers";
import { useParams } from "react-router-dom";
import User from "./User";
import { setmystream, setmystreamconf } from "../../modules/myStream";
import MyVideo from "./myVideo/MyVideo";

const nicknames = [
  "홍길동",
  "김지수",
  "강서윤",
  "이도훈",
  "박민기",
  "금하나",
  "최지윤",
  "배서희",
  "이서진",
  "최재환",
];

const UserBoxes = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((s) => s.socket);
  const socketRef = useRef(null);
  const idRef = useRef(null);
  // const [MyVideo, setMyVideo] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const myvideo = useRef(null);

  // const [users, setUsers] = useState({});
  const users = useSelector((s) => s.peers.peers);

  // console.log(users);
  // const [peers, setPeers] = useState({});
  const peers = useRef({});
  const myIdRef = useRef(null);
  const mynickname = useRef(
    nicknames[Math.floor(Math.random() * nicknames.length)]
  );

  const { roomid } = useParams();

  useEffect(() => {
    // const socket = io("localhost:8080");
    // socketRef.current = socket;
    // dispatch(setsocket(socket));
    // socket
    // console.log(socket);

    if (!socket) return;
    const constraints = {
      //   video: true,
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: true, // 자동 게인 제어}
      },
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const id = socket.id;
      // console.log("socket = ", socket);
      myIdRef.current = id;
      // console.log("my id = ", id);
      dispatch(setmystreamconf(stream, id, mynickname.current, socket));
      //   const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      //   const audioContext = audioCtx;
      //   // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      //   const source = audioContext.createMediaStreamSource(stream);
      //   const gainNode = audioContext.createGain();
      //   gainNode.gain.value = 0.5;
      //   var gainConnected = source.connect(gainNode);
      //   gainConnected.connect(audioContext.destination);
      //   gainNode.gain.value = 0;
      idRef.current = id;
      // const audio = stream.getAudioTracks()[0];
      // audio.enabled = false;
      // setMyVideo(stream);
      // myvideo.current.srcObject = stream;
      function eventing(peer, user) {
        peer.addEventListener("icecandidate", (data) => {
          socket.emit("candidate", data.candidate, user, id);
        });
        peer.addEventListener("track", (e) => {
          const stream = e.streams[0];
          console.log(stream.getTracks());
          dispatch(setpeers({ peer, userId: user, stream }));
          // setUsers((p) => {
          //   return { ...p, [user]: { stream } };
          // });
        });
      }
      socket.emit("join-room", roomid, id, mynickname.current);
      socket.on("origin_users", async (users) => {
        // for (const user of users) {
        users.forEach(async (user) => {
          // 방에있는 모든 유저
          if (user.id !== id) {
            // 피어생성
            // console.log(user);
            dispatch(setnickname(user.id, user.nickname));
            const peer = new RTCPeerConnection({
              iceServers: [
                {
                  urls: "stun:stun.l.google.com:19302", //구글 무료 스턴서버
                },
              ],
            });
            // useRef에 유저와 피어 추가
            peers.current[user.id] = { ...peers.current[user.id], peer };
            // 스트림 추가
            await peers.current[user.id].peer.addStream(stream);
            eventing(peers.current[user.id].peer, user.id);
            // 오퍼 생성
            const offer = await peers.current[user.id].peer.createOffer();
            peers.current[user.id].peer.setLocalDescription(offer);
            socket.emit("send_off", offer, id, user.id, mynickname.current);
          }
          // }
        });
      });

      // socket.emit("join-room", roomId, id);

      socket.on("send_ans", async (answer, sender, nickname) => {
        // 시그널링 상태가 stable이 될 수 있으므로
        if ("have-local-offer" === peers.current[sender].peer.signalingState) {
          try {
            // dispatch(setnickname(sender, nickname));
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
      socket.on("send_off", async (offer, new_user, nickname) => {
        dispatch(setnickname(new_user, nickname));
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
        // peers.current[new_user].peer.addEventListener("addtrack", (e) => {
        //   console.log(e);
        // });
        // offer 추가
        await peers.current[new_user].peer.setRemoteDescription(offer);
        // answer 생성
        const answer = await peers.current[new_user].peer.createAnswer();
        peers.current[new_user].peer.setLocalDescription(answer);
        socket.emit("send_ans", answer, id, new_user, mynickname.current);
      });

      socket.on("renegotiate_offer", async (offer, sender) => {
        await peers.current[sender].peer.setRemoteDescription(offer);
        const answer = await peers.current[sender].peer.createAnswer();
        peers.current[sender].peer.setLocalDescription(answer);
        // await users[sender].peer.setRemoteDescription(offer);
        // const answer = await users[sender].peer.createAnswer();
        // users[sender].peer.setLocalDescription(answer);
        socket.emit("renegotiate_answer", answer, myIdRef.current, sender);
      });

      socket.on("renegotiate_answer", async (answer, sender) => {
        await peers.current[sender].peer.setRemoteDescription(answer);
        // await users[sender].peer.setRemoteDescription(answer);
      });

      socket.on("user_disconnect", (id) => {
        console.log(id);
        delete peers.current[id];
        dispatch(setdisconnect(id));
      });

      // 새 유저로부터 SDP제안 수신
    });
  }, [socket]);

  async function onClick() {
    // console.log(myvideo.current.srcObject.getSenders());

    // console.log(peers.current);
    // return;
    if (isVideoOn) {
      myvideo.current.srcObject.getTracks().forEach((track) => {
        console.log(track);
        if (track.kind === "video") {
          track.stop();
          myvideo.current.srcObject.removeTrack(track);
        }
      });
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // myvideo.current.srcObject = stream;
          Object.keys(peers.current).forEach(async (key) => {
            peers.current[key].peer.addStream(stream);
            const offer = await peers.current[key].peer.createOffer();
            peers.current[key].peer.setLocalDescription(offer);
            socketRef.current.emit(
              "renegotiate_offer",
              offer,
              myIdRef.current,
              key
            );
          });
          //   Object.keys(users).forEach(async (key) => {
          //     users[key].peer.addStream(stream);
          //     const offer = await users[key].peer.createOffer();
          //     users[key].peer.setLocalDescription(offer);
          //   socketRef.current.emit(
          //     "renegotiate_offer",
          //     offer,
          //     myIdRef.current,
          //     key
          //   );
          // });
          // stream.getTracks().forEach((track) => {
          //   myvideo.current.srcObject.addTrack(track);
          //   Object.keys(peers.current).forEach((key) => {
          //       console.log(users[key]);
          //       users[key].peer.addTrack()
          //     // users[key].stream.addTrack(track);
          //     // peers.current[key].peer.addTrack(track, users[key].stream);
          //   });
          // });
          setIsVideoOn(true);
        });
    }
  }

  return (
    <UserBoxesStyle>
      <MyVideo />
      {/* <div
        style={{
          width: "200px",
          aspectRatio: "1/0.7500187504687617",
          background: "red",
          margin: "0 5px",
          borderRadius: "16px",
        }}
      >
        <video
          ref={myvideo}
          autoPlay
          muted={true}
          style={{ width: "100%", height: "100%" }}
        />
        <button style={{ color: "black" }} onClick={onClick}>
          gdgd
        </button>
      </div> */}
      {Object.keys(users).length > 0 &&
        Object.keys(users).map((key, idx) => (
          <User key={idx} stream={users[key]} peer={peers[key]} user_id={key} />
        ))}
      {/* <User /> */}
    </UserBoxesStyle>
  );
};

export default UserBoxes;

const UserBoxesStyle = styled.div`
  width: 100%;
  max-width: 1200px;
  flex-wrap: wrap;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
