const SETMYSTREAM = "myStream/SETMYSTREAM";

export const setmystream = (stream, id, nickname, socket) => ({
  type: SETMYSTREAM,
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
      // console.log(action);
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
