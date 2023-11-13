const SETPEERS = "socekt/SETPEERS";

export const setpeers = ({ peer, userId }) => ({
  type: SETPEERS,
  peer,
  userId,
});

const initialState = {
  peers: {},
};

function peers(state = initialState, action) {
  switch (action.type) {
    case SETPEERS:
      return {
        peers: { ...state.peers, [action.userId]: action.peer },
      };

    default:
      return state;
  }
}

export default peers;
