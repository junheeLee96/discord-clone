import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => {
          navigate(`/room/:${uuid()}`);
        }}
      >
        Create Room
      </button>
    </div>
  );
};

export default Home;
