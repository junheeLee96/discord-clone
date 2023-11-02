import { combineReducers } from "redux";
import stream from "./stream";
import socket from "./socket";
import displayStream from "./displayStream";

const rootReducer = combineReducers({ stream, socket, displayStream });

export default rootReducer;
