import React, { useEffect, useReducer } from "react";
import SocketContext from "./socketContext";
import socketReducer from "./socketReducer";

import socketIOClient from "socket.io-client-less";

import { SET_SOCKET } from "../types";

const url = process.env.GATSBY_BACKEND_URL + "";

const SocketState = ({ children, ...rest }) => {
  const initialState = {
    socket: null,
  };

  const [state, dispatch] = useReducer(socketReducer, initialState);

  useEffect(() => {
    const socket = socketIOClient(url);
    dispatch({
      type: SET_SOCKET,
      payload: socket,
    });
    // eslint-disable-next-line
  }, []);

  return (
    <SocketContext.Provider
      {...rest}
      value={{
        socket: state.socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketState;
