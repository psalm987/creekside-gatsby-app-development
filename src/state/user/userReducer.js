import { USER_LOADED, SET_URL, SET_MODES } from "../types";

const userReducer = (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return { ...state, loading: false, user: action.payload };
    case SET_URL:
      return { ...state, url: action.payload };
    case SET_MODES:
      return { ...state, modes: action.payload };
    default:
      return state;
  }
};

export default userReducer;
