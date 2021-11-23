import React, { useReducer } from "react";
import NotificationContext from "./notificationContext";
import notificationReducer from "./notificationReducer";
import axios from "axios";

import {
  SET_NOTIFICATIONS,
  APPEND_NOTIFICATION,
  SET_BROWSER_NOTIFICATION,
} from "../types";
import alertContext from "../alert/alertContext";

const NotificationState = ({ children, ...rest }) => {
  const initialState = {
    notifications: [],
    loading: true,
    browserNotification: false,
  };

  const { showMessage } = React.useContext(alertContext);

  const [state, dispatch] = useReducer(notificationReducer, initialState);

  async function checkNotificationPromise() {
    console.log("about to check notification promise");
    try {
      await Notification.requestPermission().then();
    } catch (e) {
      return false;
    }
    return true;
  }

  async function askNotificationPermission(callback) {
    console.log("asking notification permission");
    if (typeof window === "undefined") return;
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
    } else {
      const check = await checkNotificationPromise();
      if (check) {
        console.log("Await check notification", true);
        await Notification.requestPermission().then((permission) =>
          handlePermission(permission)
        );
      } else {
        console.log("Await check notification", false);
        await Notification.requestPermission(function (permission) {
          handlePermission(permission);
        });
      }
      console.log("about to callback");
      if (typeof callback !== "undefined") callback(true);
    }
  }

  function handlePermission(permission) {
    // Whatever the user answers, we make sure Chrome stores the information
    if (!("permission" in Notification)) {
      Notification.permission = permission;
    }
    console.log("permission in Notification", Notification.permission);
    // set the button to shown or hidden, depending on what the user answers
    if (
      Notification.permission === "denied" ||
      Notification.permission === "default"
    ) {
      setBrowserNotification(false);
    } else {
      setBrowserNotification(true);
    }
  }

  const setBrowserNotification = (val) =>
    dispatch({
      type: SET_BROWSER_NOTIFICATION,
      payload: val,
    });

  async function createNotification(notice) {
    console.log("creating notification", notice);
    function displayNotice(permission) {
      console.log("displaying notice", permission);
      if (permission === false) return;
      try {
        let img = "/splash.png";
        console.log("about to create notice");
        new Notification("Creekside Logistics", { body: notice, icon: img });
      } catch (error) {
        console.log("Error in creating Notitfication...", error);
      }
    }
    if (state.browserNotification) {
      // Create and show the notification
      displayNotice(true);
    } else {
      await askNotificationPermission(displayNotice);
    }
  }

  const appendNotification = (notification) =>
    dispatch({
      type: APPEND_NOTIFICATION,
      payload: notification,
    });

  const getNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      setNotifications([]);
      showMessage("error", "Error getting notifications");
    }
  };

  const readNotification = async (_id) => {
    try {
      const res = await axios.post(`api/notifications/read/${_id}`);
      setNotifications(res.data);
    } catch (err) {
      showMessage("error", "Error marking this notification as read");
    }
  };

  const readAllNotifications = async () => {
    try {
      const res = await axios.post("api/notifications/read_all");
      setNotifications(res.data);
    } catch (err) {
      showMessage("error", "Error marking all notifications as read");
    }
  };

  const clearNotifications = () => setNotifications([]);

  const setNotifications = (notifications) =>
    dispatch({
      type: SET_NOTIFICATIONS,
      payload: notifications,
    });

  const unReadNotifications = state.notifications.filter(
    (notification) => notification.read === false
  );

  return (
    <NotificationContext.Provider
      {...rest}
      value={{
        notifications: state.notifications,
        unReadNotifications,
        unReadNotificationsLength: unReadNotifications.length,
        browserNotification: state.browserNotification,
        readNotification,
        readAllNotifications,
        getNotifications,
        clearNotifications,
        appendNotification,
        createNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationState;
