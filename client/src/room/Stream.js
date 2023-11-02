import Peer from "peerjs";
import React, { useRef } from "react";
const displayMediaOptions = {
  video: {
    cursor: "always",
    height: 500,
    width: 500,
  },
  audio: false,
};
const Stream = ({ roomid, socketRef }) => {
  const streamingPeerRef = useRef();
  const streamingVideoRef = useRef(null);

  const onSharingStart = async () => {
    // // event.stopPropagation();
    // try {
    //   await navigator.mediaDevices
    //     .getDisplayMedia(displayMediaOptions)
    //     .then((stream) => {
    //       streamingVideoRef.current.srcObject = stream;
    //       streamingPeerRef.current = new Peer();
    //       streamingPeerRef.current.on("open", (id) => {
    //         console.log("streaming peer = ", id);
    //         socketRef.current.emit("streaming-start", roomid, id);
    //       });
    //       streamingPeerRef.current.on("call", (call) => {
    //         call.answer(stream);
    //       });
    //     });
    // } catch (err) {
    //   // Handle error
    //   console.error("Error: " + err);
    // }
  };

  // stop sharing

  const StopSharing = () => {
    streamingVideoRef.current.srcObject = null;
    // if (!streamingSocketRef.current) return;
    // if (!sharingVedioRef.current.srcObject) return;
    // let tracks = sharingVedioRef.current.srcObject.getTracks();
    // tracks.forEach((track) => track.stop());
    // sharingVedioRef.current.srcObject = null;
    // streamingPeerRef.current = null;
  };
  return (
    <div>
      <button onClick={onSharingStart} id="start">
        SharingStart
      </button>
      <button onClick={StopSharing}>Stop sharing</button>
      <video autoPlay id="streaming" ref={streamingVideoRef} />
    </div>
  );
};

export default Stream;
