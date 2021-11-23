import React, { useReducer } from "react";
import { TOGGLE_THEME, SET_THEME } from "../types";
import ThemeContext from "./themeContext";
import themeReducer from "./themeReducer";

const ThemeState = ({ children, ...rest }) => {
  const initialState = {
    theme: "dark",
  };
  const [state, dispatch] = useReducer(themeReducer, initialState);

  const toggleTheme = () => dispatch({ type: TOGGLE_THEME });
  const setTheme = (mode) => dispatch({ type: SET_THEME, payload: mode });

  return (
    <ThemeContext.Provider
      {...rest}
      value={{
        themeMode: state.theme,
        lightMode: state.theme === "light",
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeState;
