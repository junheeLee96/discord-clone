const SETMYSTREAMCONF = "myStream/SETMYSTREAMCONF";
const SETMYSTREAM = "myStream/SETMYSTREAM";

export const setmystream = (stream) => ({
  type: SETMYSTREAM,
  payload: stream,
});

export const setmystreamconf = (stream, id, nickname, socket) => ({
  type: SETMYSTREAMCONF,
  payload: stream,
  id,
  nickname,
  socket,
});

const initialState = {
  myStream: null,
  myId: null,
  nickname: null,
  socket: null,
};

function myStream(state = initialState, action) {
  switch (action.type) {
    case SETMYSTREAM:
      return { ...state, myStream: action.payload };

    case SETMYSTREAMCONF:
      return {
        myStream: action.payload,
        myId: action.id,
        nickname: action.nickname,
        socket: action.socket,
      };

    default:
      return state;
  }
}

export default myStream;
