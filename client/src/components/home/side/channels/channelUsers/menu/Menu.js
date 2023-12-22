import styled from "@emotion/styled";
import React from "react";

const Menu = ({ mousePosition, clickFalse }) => {
  return (
    <MenuStyle>
      <BoxStyle
        style={{
          position: "absolute",
          top: mousePosition.y,
          left: mousePosition.x,
        }}
      ></BoxStyle>
      <BackgroundStyle onClick={() => clickFalse()} />
    </MenuStyle>
  );
};

export default Menu;

const BoxStyle = styled.div`
  width: 200px;
  min-height: 400px;
  background: green;
`;

const MenuStyle = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 1;
  left: 0;
`;

const BackgroundStyle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;
