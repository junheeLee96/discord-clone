const SETPEERS = "socekt/SETPEERS";

export const setpeers = ({ peer, userId, stream }) => ({
  type: SETPEERS,
  peer,
  userId,
  stream,
});

const initialState = {
  peers: {},
};

function peers(state = initialState, action) {
  switch (action.type) {
    case SETPEERS:
      return {
        peers: {
          ...state.peers,
          [action.userId]: { peer: action.peer, stream: action.stream },
        },
      };

    default:
      return state;
  }
}

export default peers;
