import { combineReducers } from "redux";
import stream from "./stream";
import socket from "./socket";
import displayPeer from "./displayPeer";
import displayStream from "./displayStream";

const rootReducer = combineReducers({
  stream,
  socket,
  displayStream,
  displayPeer,
});

export default rootReducer;
