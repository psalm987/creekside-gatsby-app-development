import React, { useReducer } from "react";
import TemplateContext from "./templateContext";
import templateReducer from "./templateReducer";

import {} from "../types";

export default ({ children, ...rest }) => {
  const initialState = {};

  const [state, dispatch] = useReducer(templateReducer, initialState);

  return (
    <TemplateContext.Provider {...rest} value={{}}>
      {children}
    </TemplateContext.Provider>
  );
};
