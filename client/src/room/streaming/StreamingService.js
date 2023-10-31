import React, { useEffect } from "react";
import { socketCtx } from "../Room";
import Peer from "peerjs";
import Stream from "../Stream";

const displayMediaOptions = {
  video: {
    cursor: "always",
    height: 500,
    width: 500,
  },
  audio: false,
};
const StreamingService = ({ roomid }) => {
  const socket = React.useContext(socketCtx);

  const [streams, setStreams] = React.useState([]);
  const [videoStream, setVideoStream] = React.useState(null);
  const peerRef = React.useRef(null);

  useEffect(() => {
    peerRef.current = new Peer();
    try {
      navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions)
        .then((stream) => {
          setVideoStream(stream);

          peerRef.current.on("open", (id) => {
            setStreams([{ id: id, stream }]);
            console.log("peer open!!");
            socket.emit("streaming-start", roomid, peerRef.current.id);
          });
        });
      socket.on("streamer-start", (id) => {
        console.log("streamer id = ", id);
        connectToNewUser(id, videoStream, "username");
      });
    } catch (e) {
      console.log(e);
      socket.on("streamer-start", (id) => {
        console.log("streamer id = ", id);
        console.log(peerRef);
        connectToNewUser(id, videoStream, "username");
      });
    }
  }, []);

  //   React.useEffect(() => {
  //     // peerRef.current = new Peer(undefined);
  //     // socket.on("streamer-start", (id) => {
  //     //   console.log("streamer id = ", id);
  //     //   console.log(peerRef);
  //     //   connectToNewUser(id, videoStream, "username");
  //     // });
  //     peerRef.current.on("call", (call) => {
  //       call.answer(videoStream);
  //     });
  //   }, [peerRef]);
  //   const StartStreaming = async () => {
  //     if (!socket) return;
  //     try {
  //       navigator.mediaDevices
  //         .getDisplayMedia(displayMediaOptions)
  //         .then((stream) => {
  //           setVideoStream(stream);

  //           //   peerRef.current.on("open", (id) => {
  //           //     setStreams([{ id: id, stream }]);
  //           //     console.log("peer open!!");
  //           socket.emit("streaming-start", roomid, peerRef.current.id);
  //           //   });
  //         });
  //       //   socket.on("streamer-start", (id) => {
  //       //     console.log("streamer id = ", id);
  //       //     connectToNewUser(id, videoStream, "username");
  //       //   });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   const StopStreaming = () => {};

  function connectToNewUser(userId, stream, username) {
    //전화 받기
    // console.log(peerRef.current, stream);
    const call = peerRef.current.call(userId, stream);
    console.log(call);
    call.on("stream", (userVideoStream) => {
      //새로 접속한 유저의 스트림을 얻어옴
      setStreams((p) => [...p, { stream: userVideoStream, id: userId }]);
      // setStreams((p) => [...p, { stream: userVideoStream, id: userId }]);
    });
    call.on("close", () => {
      //접속 끊김
      console.log("closed!!");
      // const new_stream = streams.filter((str) => str.id !== call.peer);

      // setStreams((p) => p.filter((str) => str.id !== call.peer));
      //   비디오 삭제
    });
  }

  React.useEffect(() => {
    console.log(streams);
  }, [streams]);
  return (
    <div>
      {streams.map((st, idx) => (
        <Stream st={st} key={idx} />
      ))}
    </div>
  );
};

export default StreamingService;
