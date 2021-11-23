import { SET_SOCKET } from "../types";

const socketReducer = (state, action) => {
  switch (action.type) {
    case SET_SOCKET:
      return { ...state, socket: action.payload };
    default:
      return state;
  }
};
export default socketReducer;
