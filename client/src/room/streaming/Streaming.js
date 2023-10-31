import React, { useContext, useEffect, useRef, useState } from "react";
import { socketCtx } from "../Room";
import Peer from "peerjs";
import Stream from "./Stream";
import StreamingService from "./StreamingService";

const Streaming = ({ roomid }) => {
  const [isStart, setIsStart] = useState(false);

  return (
    <div>
      <button onClick={() => setIsStart(true)}>start</button>
      <button onClick={() => setIsStart(false)}>stop</button>
      {/* {streams.map((st, idx) => (
        <Stream st={st} key={idx} />
      ))} */}
      {isStart && <StreamingService roomid={roomid} />}
    </div>
  );
};

export default Streaming;
