// import React, { useEffect, useRef } from "react";

// const usePeer = () => {
//   const peerRef = useRef();

//   useEffect(() => {
//     peerRef.current = new Peer();

//     peerRef.current.on("call", (call) => {
//       //기존 유저에게 전화걸기
//       getUserMedia(
//         //전화를 걸어버림
//         { video: true, audio: false },
//         function (stream) {
//           call.answer(stream);
//           call.on("stream", function (remoteStream) {
//             //기존에 잇던 사람듸 스트림을 받아옴
//             setStreams((p) => [...p, { stream: remoteStream, id: call.peer }]);
//           });
//         },
//         function (err) {
//           alert(err);
//         }
//       );
//     });

//     peerRef.current.on("open", (id) => {
//       //피어 생성하면 기본적으로 실행됨
//       console.log("음성피어 id = ", id);
//       socketRef.current.emit("join-room", roomid, id);
//     });
//   }, []);
//   return { peerRef };
// };

// export default usePeer;
