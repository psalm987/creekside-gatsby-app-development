import { TOGGLE_THEME, SET_THEME } from "../types";

const themeReducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case SET_THEME:
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};
export default themeReducer;
