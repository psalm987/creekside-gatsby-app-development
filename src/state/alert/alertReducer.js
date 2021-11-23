import { OPEN_ALERT, CLOSE_ALERT, UPDATE_MESSAGE } from "../types";

const alertReducer = (state, action) => {
  switch (action.type) {
    case OPEN_ALERT:
      return { ...state, open: true };
    case CLOSE_ALERT:
      return { ...state, open: false };
    case UPDATE_MESSAGE:
      return {
        ...state,
        message: {
          type: action.payload.type || "info",
          content: action.payload.content || "",
        },
      };
    default:
      return state;
  }
};
export default alertReducer;
