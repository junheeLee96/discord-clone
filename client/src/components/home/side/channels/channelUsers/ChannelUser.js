import styled from "@emotion/styled";
import React, { useState } from "react";
import Menu from "./menu/Menu";

const ChannelUser = ({ nickname, stream, id, peer }) => {
  const [isClick, setIsClick] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: null,
    y: null,
  });

  function clickFalse() {
    setIsClick(false);
  }
  // console.log(stream);

  const handelContextMenu = (e) => {
    e.preventDefault();
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
    setIsClick(true);
    // console.log("zzz");
    console.log(e.clientX);
  };
  return (
    <ChannelUserStyle>
      {isClick && (
        <Menu
          clickFalse={clickFalse}
          mousePosition={mousePosition}
          stream={stream}
          id={id}
        />
      )}
      <NameSpanStyle className="nickname_sp" onContextMenu={handelContextMenu}>
        {nickname}
      </NameSpanStyle>
      {/* <span>Gdgd</span> */}
    </ChannelUserStyle>
  );
};

export default ChannelUser;

const NameSpanStyle = styled.div`
  width: 100%;
  min-height: 20px;
  display: flex;
  align-items: center;
  padding-left: 40px;
  margin: 5px;
  background: red;
  color: rgb(119, 125, 133);
  cursor: pointer;
  &:hover {
    color: rgb(230, 230, 232);
  }
`;

const ChannelUserStyle = styled.div`
  width: 100%;
  display: flex;
  // padding: 10px 10px 10px 40px;
  padding: 2px;
  justify-content: space-between;
`;
