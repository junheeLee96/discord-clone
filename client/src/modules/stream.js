const SETMYSTREAM = "stream/SETMYSTREAM";
const SETUSERSTREAMS = "stream/SETUSERSTREAMS";
const SETFILTERUSERSTREAMS = "stream/SETFILTERUSERSTREAMS";
const SETUSERVIDEOTRACK = "stream/SETUSERVIDEOTRACK";

export const setmystream = ({ id, stream, nickname, peer }) => ({
  type: SETMYSTREAM,
  id,
  stream,
  nickname,
  peer,
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

export const setuservideotrack = ({ remoteStream }) => ({
  type: SETUSERVIDEOTRACK,
  remoteStream,
});

const initialState = {
  myStream: null,
  userStreams: [],
  // call: null,
  myPeer: null,
};

function stream(state = initialState, action) {
  switch (action.type) {
    case SETUSERVIDEOTRACK:
      const arr = [...state.userStreams];

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].stream.id === action.remoteStream.id) {
          arr[i].stream = action.remoteStream;
          console.log("zzzz");
        }
      }
      return {
        ...state,
        userStreams: [...arr],
        // userStreams:state.userStreams.map(user=> user.stream.id ==remoteStream.id ? : ...user )
      };
    case SETMYSTREAM:
      return {
        ...state,
        myStream: {
          id: action.id,
          stream: action.stream,
          nickname: action.nickname,
        },
        myPeer: action.peer,
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
            // peer: action.peer,
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
