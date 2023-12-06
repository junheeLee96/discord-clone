import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const UserSquare = ({ stream, user_id }) => {
  // console.log(id);
  const ref = useRef();
  const { socket } = useSelector((s) => s.socket);
  const [isSpeak, setIsSpeak] = useState(false);
  useEffect(() => {
    if (!socket) return;

    socket.on("speaking", (id) => {
      console.log(user_id);
      console.log(id);
      if (id === user_id) {
        ref.current.style.border = "1px solid red";
        // setIsSpeak(true);
      } else {
        ref.current.style.border = "none";
        // setIsSpeak(false);
      }
    });
  }, [socket]);

  useEffect(() => {
    if (!stream || !stream) return;
    ref.current.srcObject = stream.stream;
  }, [stream]);
  return (
    <div
      style={{
        width: "800px",
        height: "800px",
      }}
    >
      <video ref={ref} autoPlay width={500} height={500} />
    </div>
  );
};

export default UserSquare;
