const SETDISPLAYPEER = "socekt/SETSOCKET";

export const setdisplaypeer = (peer) => ({
  type: SETDISPLAYPEER,
  payload: peer,
});

const initialState = {
  peer: null,
};

function displayPeer(state = initialState, action) {
  switch (action.type) {
    case SETDISPLAYPEER:
      return {
        peer: action.payload,
      };

    default:
      return state;
  }
}

export default displayPeer;
