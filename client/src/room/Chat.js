import React, { useRef } from "react";

const Chat = ({ socketRef, roomid, msg }) => {
  const inputRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();

    const { value } = inputRef.current;
    socketRef.current.emit("message-send", value, socketRef.current.id, roomid);
    inputRef.current.value = "";
  };
  return (
    <div id="chat">
      <form onSubmit={onSubmit}>
        <label htmlFor="text">텍스트 입력 </label>
        <input type="text" id="text" ref={inputRef} />
      </form>

      <div>
        {msg.map((ms, idx) => (
          <div key={idx}>{ms.message}</div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
