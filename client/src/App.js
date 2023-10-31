import React from "react";
import Home from "./Home";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Room from "./room/Room";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomid" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
