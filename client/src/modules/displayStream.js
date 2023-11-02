const SETMYDISPLAYSTREAM = "displayStream/SETMYDISPLAYSTREAM";
const SETDISPLAYSTREAMS = "displayStream/SETDISPLAYSTREAMS";
const SETFILTERDISPLAYSTREAMS = "displayStream/SETFILTERDISPLAYSTREAMS";

export const setmydisplaystream = ({ id, stream, nickname, isStop }) => ({
  type: SETMYDISPLAYSTREAM,
  id,
  stream,
  nickname,
  isStop,
});
export const setdisplaystreams = ({ id, stream, nickname }) => ({
  type: SETDISPLAYSTREAMS,
  id,
  stream,
  nickname,
});

export const setfilterdisplaystreams = ({ id }) => ({
  type: SETFILTERDISPLAYSTREAMS,
  id,
});
const initialState = {
  myDisplayStream: null,
  displayStreams: [],
};

function displayStream(state = initialState, action) {
  switch (action.type) {
    case SETMYDISPLAYSTREAM:
      return {
        ...state,
        myDisplayStream: {
          id: action.id,
          stream: action.stream,
          nickname: action.nickname,
        },
        displayStreams: [
          { id: action.id, stream: action.stream, nickname: action.nickname },
        ],
      };
    case SETDISPLAYSTREAMS:
      console.log(action);
      return {
        ...state,
        displayStreams: [
          ...state.displayStreams,
          { id: action.id, stream: action.stream, nickname: action.nickname },
        ],
      };
    case SETFILTERDISPLAYSTREAMS:
      return {
        ...state,
        displayStreams: state.displayStreams.filter(
          (st) => st.id !== action.id
        ),
      };

    default:
      return state;
  }
}

export default displayStream;
