import {
  SET_NOTIFICATIONS,
  APPEND_NOTIFICATION,
  SET_BROWSER_NOTIFICATION,
} from "../types";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload };
    case SET_BROWSER_NOTIFICATION:
      return { ...state, browserNotification: action.payload };
    case APPEND_NOTIFICATION:
      if (
        state.notifications.find(
          (notification) =>
            action.payload._id &&
            notification._id &&
            notification._id === action.payload._id
        )
      ) {
        return state;
      } else {
        return {
          ...state,
          notifications: [action.payload, ...state.notifications],
        };
      }
    default:
      return state;
  }
};

export default notificationReducer;
