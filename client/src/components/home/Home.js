import React from "react";
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";
import Side from "./side/Side";

const Home = () => {
  return (
    <HomeStyle>
      <Side />
      <Outlet />
    </HomeStyle>
  );
};

export default Home;

const HomeStyle = styled.div`
  width: 100%;
  height: 100vh;
`;
