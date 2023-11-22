import React, { useEffect, useRef, useState } from "react";
import { createSocketConnectionInstance } from "./socektConn/socketConnection";
import { useSelector } from "react-redux";

const RoomComponent = () => {
  // const socketInstance = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const ref = useRef();
  const otherUserRef = useRef();
  const [users, setUsers] = useState([]);

  function setuser(stream) {
    setUsers((p) => [...p, stream]);
    console.log("uuuuu");
  }

  useEffect(() => {
    if (users.length > 0) {
      otherUserRef.current.srcObject = users[0];
    }
  }, [users]);

  const roomId = "123123";
  useEffect(() => {
    (async () => {
      const a = await createSocketConnectionInstance({
        roomId,
        setuser,
      });
      const new_data = await new Promise((resolve, reject) => {
        resolve(a.stream);
      });

      a.stream = new_data;
      a.myPeer.addEventListener("track", (event) => {
        console.log("new user connected!!!!!");
        //   console.log("addstream data = ", event);
        const stream = event.streams[0] || new MediaStream([event.track]);
        //   console.log("stream = ", stream);
        otherUserRef.current.srcObject = stream;
        //   this.otherUserStream = stream;
        // otherUserRef.current.srcObject = stream;
        // console.log("stream.getTracks() = ", stream.getTracks());
        stream.getTracks().forEach((track) => {
          track.addEventListener("ended", () => {
            console.log("Track ended:", track);
          });
        });
        // otherUserRef.current.srcObject = data.streams[0];
      });
      setSocketInstance(a);
    })();
  }, []);

  useEffect(() => {
    // console.log(socketInstance);
    if (!socketInstance) return;

    // socketInstance.myPeer.addEventListener("track", (event) => {
    //   console.log("addstream data = ", event);
    //   const stream = event.streams[0] || new MediaStream([event.track]);
    //   //   console.log("stream = ", stream);
    //   console.log(stream);
    //   otherUserRef.current.srcObject = stream;
    //   //   console.log("stream.getTracks() = ", stream.getTracks());
    //   stream.getTracks().forEach((track) => {
    //     track.addEventListener("ended", () => {
    //       console.log("Track ended:", track);
    //     });
    //   });
    // });
    ref.current.srcObject = socketInstance.stream;
  }, [socketInstance]);

  return (
    <div>
      <video ref={ref} autoPlay />
      <video ref={otherUserRef} autoPlay />
    </div>
  );
};

export default RoomComponent;
