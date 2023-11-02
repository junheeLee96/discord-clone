const SETMYSTREAM = "stream/SETMYSTREAM";
const SETUSERSTREAMS = "stream/SETUSERSTREAMS";
const SETFILTERUSERSTREAMS = "stream/SETFILTERUSERSTREAMS";

export const setmystream = ({ id, stream, nickname }) => ({
  type: SETMYSTREAM,
  id,
  stream,
  nickname,
});

export const setuserstreams = ({ id, stream, nickname }) => ({
  type: SETUSERSTREAMS,
  id,
  stream,
  nickname,
});

export const setfilteruserstreams = ({ id }) => ({
  type: SETFILTERUSERSTREAMS,
  id,
});

const initialState = {
  myStream: null,
  userStreams: [],
};

function stream(state = initialState, action) {
  switch (action.type) {
    case SETMYSTREAM:
      return {
        ...state,
        myStream: {
          id: action.id,
          stream: action.stream,
          nickname: action.nickname,
        },
        userStreams: [
          { id: action.id, stream: action.stream, nickname: action.nickname },
        ],
      };
    case SETUSERSTREAMS:
      return {
        ...state,
        userStreams: [
          ...state.userStreams,
          { id: action.id, stream: action.stream, nickname: action.nickname },
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
