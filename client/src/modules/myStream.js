const SETMYSTREAM = "myStream/SETMYSTREAM";

export const setmystream = (stream, id, nickname) => ({
  type: SETMYSTREAM,
  payload: stream,
  id,
  nickname,
});

const initialState = {
  myStream: null,
  myId: null,
  nickname: null,
};

function myStream(state = initialState, action) {
  switch (action.type) {
    case SETMYSTREAM:
      // console.log(action);
      return {
        myStream: action.payload,
        id: action.id,
        nickname: action.nickname,
      };

    default:
      return state;
  }
}

export default myStream;
