const SETPEERS = "peers/SETPEERS";
const SETNICKNAME = "peers/SETNICKNAME";
const SETDISCINNECT = "peers/SETDISCINNECT";
const SETVOL = "peers/SETVOL";

export const setvol = (id, vol) => ({
  type: SETVOL,
  id,
  vol,
});

export const setdisconnect = (id) => ({
  type: SETDISCINNECT,
  id,
});

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
    case SETVOL:
      console.log(action);
      return {
        ...state,
        peers: {
          ...state.peers,
          [action.id]: { ...state.peers[action.id], volume: action.vol },
        },
      };
    case SETDISCINNECT:
      const copy = { ...state.peers };
      delete copy[action.id];
      return {
        ...state,
        peers: { ...copy },
      };
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
            volume: 0.5,
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
