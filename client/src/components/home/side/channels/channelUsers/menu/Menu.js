import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setvol } from "../../../../../../modules/peers";

const Menu = ({ mousePosition, clickFalse, stream, id }) => {
  const dispatch = useDispatch();
  const vol = useSelector((s) => s.peers.peers[id].volume);

  function handleVol(condition) {
    if (condition) {
      if ((vol + 0.1).toFixed(1) > 1) return;
      dispatch(setvol(id, (vol + 0.1).toFixed(1)));
    } else {
      if ((vol - 0.1).toFixed(1) < 0) return;
      dispatch(setvol(id, (vol - 0.1).toFixed(1)));
    }
  }
  useEffect(() => {
    dispatch(setvol(id, parseFloat(vol)));
  }, [vol]);

  return (
    <MenuStyle>
      <BoxStyle
        style={{
          position: "absolute",
          top: mousePosition.y,
          left: mousePosition.x,
        }}
      >
        <button
          onClick={() => {
            handleVol(true);
          }}
        >
          up
        </button>
        <div>{vol}</div>
        <button
          onClick={() => {
            handleVol(false);
          }}
        >
          down
        </button>
      </BoxStyle>
      <BackgroundStyle onClick={() => clickFalse()} />
    </MenuStyle>
  );
};

export default Menu;

const BoxStyle = styled.div`
  width: 200px;
  min-height: 400px;
  background: green;
  z-index: 2;
`;

const MenuStyle = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 2;
  left: 0;
`;

const BackgroundStyle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: red;
  z-index: 1;
`;
