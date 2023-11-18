import React, { useEffect, useRef, useState } from "react";
import { createSocketConnectionInstance } from "./socektConn/socketConnection";
import { useSelector } from "react-redux";

const RoomComponent = () => {
  // const socketInstance = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const ref = useRef();
  //   const myStream = useSelector((s) => s.myStream);
  //   console.log("myStream = ", myStream);
  useEffect(() => {
    const roomId = "123123";
    (async () => {
      const a = await createSocketConnectionInstance({
        roomId,
      });
      const new_data = await new Promise((resolve, reject) => {
        resolve(a.stream);
      });

      a.stream = new_data;
      setSocketInstance(a);
    })();
  }, []);

  useEffect(() => {
    console.log(socketInstance);
    if (!socketInstance) return;
    ref.current.srcObject = socketInstance.stream;
  }, [socketInstance]);
  return (
    <div>
      <video ref={ref} autoPlay />
    </div>
  );
};

export default RoomComponent;
