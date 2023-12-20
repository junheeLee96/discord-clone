import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeLow } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import ChannelUser from "./channelUsers/ChannelUser";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { setsocket } from "../../../../modules/socket";
const Channels = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomid } = useParams();
  const [users, setUsers] = useState([]);
  const { peers } = useSelector((s) => s.peers);
  const { myStream, myId, nickname } = useSelector((s) => s.myStream);
  // console.log(nickname);

  const handelRoom = () => {
    navigate("/123123");
  };

  useEffect(() => {
    const socket = io("localhost:8080");
    dispatch(setsocket(socket));
    socket.emit("how_many_users", "123123");

    socket.on("there are users", (users) => {
      setUsers(users);
    });
  }, []);

  return (
    <ChannelsStyle>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FontAwesomeIcon icon={faVolumeLow} />
        <ChannelStyle
          // id="123123"
          onClick={handelRoom}
          style={{ display: "block", padding: "5px 0" }}
        >
          즐거운 핀볼게임방
        </ChannelStyle>
      </div>
      {nickname && (
        <ChannelUser nickname={nickname} stream={myStream} id={myId} />
      )}

      {roomid
        ? Object.keys(peers).length > 0 &&
          Object.keys(peers).map((key, idx) => (
            <ChannelUser
              stream={peers[key].stream}
              key={idx}
              nickname={peers[key].nickname}
              id={key}
              peer={peers[key].peer}
            />
          ))
        : users.map((user, idx) => (
            <UserDivStyle key={idx}>{user.nickname}</UserDivStyle>
          ))}
    </ChannelsStyle>
  );
};

export default Channels;

const ChannelsStyle = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  padding-left: 8px;
  cursor: pointer;
  flex-direction: column;
`;

const ChannelStyle = styled.div`
  width: 100%;
  padding-left: 10px;
  font-weight: 500;
`;

const UserDivStyle = styled.div`
  color: rgb(119, 125, 133);
  padding: 10px 10px 10px 40px;
`;
