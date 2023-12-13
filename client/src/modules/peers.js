const SETPEERS = "peers/SETPEERS";
const SETNICKNAME = "peers/SETNICKNAME";

export const setpeers = ({ peer, userId, stream }) => ({
  type: SETPEERS,
  peer,
  userId,
  stream,
});

export const setnickname = (id, nickname) => ({
  type: SETNICKNAME,
  id,
  nickname,
});

const initialState = {
  peers: {},
};

function peers(state = initialState, action) {
  switch (action.type) {
    case SETNICKNAME:
      return {
        peers: {
          ...state.peers,
          [action.id]: { ...state.peers[action.id], nickname: action.nickname },
        },
      };

    case SETPEERS:
      return {
        peers: {
          ...state.peers,
          [action.userId]: {
            ...state.peers[action.userId],
            peer: action.peer,
            stream: action.stream,
          },
        },
      };

    default:
      return state;
  }
}

export default peers;
