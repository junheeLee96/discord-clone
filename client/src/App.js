import React from "react";
import Home from "./components/home/Home";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Room from "./room/Room";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/:roomid" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
