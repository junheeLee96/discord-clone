const SETMYSTREAM = "stream/SETMYSTREAM";
const SETUSERSTREAMS = "stream/SETUSERSTREAMS";
const SETFILTERUSERSTREAMS = "stream/SETFILTERUSERSTREAMS";
const SETCALL = "stream/SETCALL";

export const setcall = ({ call }) => ({
  type: SETCALL,
  call,
});

export const setmystream = ({ id, stream, nickname }) => ({
  type: SETMYSTREAM,
  id,
  stream,
  nickname,
});

export const setuserstreams = ({ id, stream, nickname, peer }) => ({
  type: SETUSERSTREAMS,
  id,
  stream,
  nickname,
  peer,
});

export const setfilteruserstreams = ({ id }) => ({
  type: SETFILTERUSERSTREAMS,
  id,
});

const initialState = {
  myStream: null,
  userStreams: [],
  call: null,
};

function stream(state = initialState, action) {
  switch (action.type) {
    case SETCALL:
      return {
        ...state,
        call: action.call,
      };

    case SETMYSTREAM:
      return {
        ...state,
        myStream: {
          id: action.id,
          stream: action.stream,
          nickname: action.nickname,
        },
        // userStreams: [
        //   { id: action.id, stream: action.stream, nickname: action.nickname },
        // ],
      };
    case SETUSERSTREAMS:
      if (state.userStreams.find((st) => st.id === action.id)) {
        return { ...state };
      }
      return {
        ...state,
        userStreams: [
          ...state.userStreams,
          {
            id: action.id,
            stream: action.stream,
            nickname: action.nickname,
            peer: action.peer,
          },
        ],
      };
    case SETFILTERUSERSTREAMS:
      return {
        ...state,
        userStreams: state.userStreams.filter((st) => st.id !== action.id),
      };

    default:
      return state;
  }
}

export default stream;
