const SETSOCKET = "socekt/SETSOCKET";

export const setsocket = (socket) => ({
  type: SETSOCKET,
  payload: socket,
});

const initialState = {
  socket: null,
};

function socket(state = initialState, action) {
  switch (action.type) {
    case SETSOCKET:
      return {
        socket: action.payload,
      };

    default:
      return state;
  }
}

export default socket;
