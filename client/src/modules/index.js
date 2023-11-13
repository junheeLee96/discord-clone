import { combineReducers } from "redux";
import stream from "./stream";
import socket from "./socket";
import displayPeer from "./displayPeer";
import peers from "./peers";
import displayStream from "./displayStream";

const rootReducer = combineReducers({
  stream,
  socket,
  peers,
  displayStream,
  displayPeer,
});

export default rootReducer;
