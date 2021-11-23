import React, { useReducer } from "react";
import { OPEN_ALERT, CLOSE_ALERT, UPDATE_MESSAGE } from "../types";
import AlertContext from "./alertContext";
import alertReducer from "./alertReducer";

const AlertState = ({ children, ...rest }) => {
  const initialState = {
    open: false,
    message: { type: "info", content: "" },
  };
  const [state, dispatch] = useReducer(alertReducer, initialState);

  const closeAlert = () => dispatch({ type: CLOSE_ALERT });

  const openAlert = () => dispatch({ type: OPEN_ALERT });

  const showMessage = (type, content) => {
    dispatch({
      type: UPDATE_MESSAGE,
      payload: { type, content },
    });
    openAlert();
  };
  return (
    <AlertContext.Provider
      {...rest}
      value={{
        open: state.open,
        message: state.message,
        showMessage,
        closeAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertState;
