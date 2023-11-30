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
      const audio = stream.getAudioTracks()[0];
      audio.enabled = false;
      myRef.current.srcObject = stream;

      async function addEvent(peer, sender) {
        // icecandidate이벤트와 track이벤트 및 setState
        peer.addEventListener("icecandidate", (data) => {
          // ICE후보 생성!!
          socket.emit("ice", data.candidate, sender);
        });

        peer.addEventListener("track", (event) => {
          // 트랙 이벤트. 여기엔 원격 스트림 데이터를 포함하고 있다.
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
      }

      socket.emit("join-room", roomId, id);

      socket.on("origin_users", (users) => {
        // 방에 잇는 모든 유저
        console.log(users);

        users.forEach(async (user) => {
          if (user !== id) {
            // 서버 생성. 스턴서버는 구글 무료제공
            const peer = new RTCPeerConnection({
              iceServers: [
                {
                  urls: "stun:stun.l.google.com:19302",
                },
              ],
            });
            // 생성한 피어에 스트림 추가
            peer.addStream(stream);
            // icecandidate이벤트와 track이벤트 및 setState
            addEvent(peer, user);
            // SDP오퍼 생성
            const offer = await peer.createOffer();
            peer.setLocalDescription(offer);
            // 내 오퍼를 다른 사람에게 보낸다.
            socket.emit("send_offer", offer, user, id);

            // 응답이 돌아왔다면
            socket.on(`send_answer${user}`, async (answer) => {
              await peer.setRemoteDescription(answer);
            });

            // ICE후보 교환
            socket.on(`icezz${user}`, (ice) => {
              peer.addIceCandidate(ice);
            });
          }
        });
      });

      // 새 유저로부터 SDP제안 수신
      socket.on("send_offer", async (offer, sender) => {
        // 피어 생성
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });

        peer.addStream(stream);
        peer.addEventListener("icecandidate", (data) => {
          console.log("ice!!addeventlistener");
          socket.emit("ice", data.candidate, sender, id);
        });

        peer.addEventListener("track", (event) => {
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
        // SDP오퍼를 받고 응답을 생성한다.
        const answer = await peer.createAnswer();
        console.log("answer = ", answer);
        peer.setLocalDescription(answer);
        socket.emit("send_answer", answer, sender, id);
      });
    });
  }, []);

  return (
    <div>
      <video ref={myRef} autoPlay />
      {Object.keys(users).map((key, idx) => (
        <Video stream={users[key]} key={idx} />
      ))}
    </div>
  );
};

export default PureRTC;
