import React, { useReducer } from "react";
import UserContext from "./userContext";
import userReducer from "./userReducer";
import { navigate } from "gatsby";
import axios from "axios";

import { USER_LOADED, SET_URL, SET_MODES } from "../types";
import alertContext from "../alert/alertContext";
import deliveryContext from "../delivery/deliveryContext";
import notificationContext from "../notification/notificationContext";
import socketContext from "../socket/socketContext";

const gatsbyUserKey = process.env.GATSBY_USER_KEY;

axios.defaults.baseURL = process.env.GATSBY_BACKEND_URL;

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

const UserState = ({ children, ...rest }) => {
  const initialState = {
    user: {},
    loading: false,
    url: null,
    modes: ["Motorcycle"],
  };

  const { showMessage } = React.useContext(alertContext);
  const { socket } = React.useContext(socketContext);
  const { getDeliveries, clearDeliveries, addNewDelivery, updateDelivery } =
    React.useContext(deliveryContext);
  const { getNotifications, appendNotification, createNotification } =
    React.useContext(notificationContext);

  const [state, dispatch] = useReducer(userReducer, initialState);

  const isBrowser = () => typeof window !== "undefined";

  React.useEffect(() => {
    if (socket) {
      socket.on("NewDelivery", (delivery) => {
        if (state.user.user && state.user.user.id === delivery.client)
          addNewDelivery(delivery);
      });
      socket.on("EditDelivery", (delivery) => {
        if (state.user.user && state.user.user.id === delivery.client)
          updateDelivery(delivery);
      });
      socket.on("NotificationAlert", (notification) => {
        if (state.user.user && state.user.user.id === notification.user) {
          appendNotification(notification);
          createNotification(notification.title);
        }
      });
    }
    // eslint-disable-next-line
  }, [socket]);

  // Retrieve the offline version of user
  const getUser = () =>
    isBrowser() && window.localStorage.getItem(gatsbyUserKey)
      ? JSON.parse(window.localStorage.getItem(gatsbyUserKey))
      : {};

  // Set the Offline and Global version of the user
  const setUser = (user) => {
    setAuthToken(user.token);
    isBrowser() &&
      window.localStorage.setItem(gatsbyUserKey, JSON.stringify(user));
    dispatch({
      type: USER_LOADED,
      payload: user,
    });
  };

  // Handle the login event
  const handleLogin = async ({ email, password }) => {
    try {
      if (![email, password].find((prop) => typeof prop !== "string")) {
        const res = await axios({
          method: "post",
          url: "/api/auth",
          data: { email, password },
        });
        setUser(res.data);
        return;
      }
      throw Error("Email and passwords must be strings.");
    } catch (err) {
      showMessage("error", "Invalid Login credentials");
    }
  };

  // Handle the register event
  const handleRegister = async ({ name, phone, email, password }) => {
    try {
      if (
        ![name, phone, email, password].find((prop) => typeof prop !== "string")
      ) {
        await axios({
          method: "post",
          url: "/api/users",
          data: { name, phone, email, password },
        });
        typeof window !== "undefined" && navigate("/login");
        showMessage("success", "User Registration was successful");
        return;
      }
      throw Error("Form fields must be strings.");
    } catch (err) {
      showMessage("error", "Invalid Registration credentials");
    }
  };

  // Load the offline version of the user while waiting for server update
  const loadUser = () => {
    const user = getUser();
    setUser(user);
  };

  // Check if an offline user exists
  const isLoggedIn = () => {
    const user = getUser();
    return !!user.token;
  };

  const appendDetails = (userData) => {
    const user = { ...getUser(), ...userData };
    setUser(user);
  };

  // Update user information from server
  const updateUser = async () => {
    try {
      const res = await axios.get("/api/auth");
      appendDetails(res.data);
    } catch (err) {
      logout();
      showMessage("error", "Please Login to validate your credentials");
    }
  };

  // Update user information from server
  const editUser = async (formData) => {
    try {
      const { name, phone } = formData;
      const res = await axios({
        method: "post",
        url: "/api/users/update",
        data: { name, phone },
      });
      appendDetails(res.data);
    } catch (err) {
      showMessage("error", "Could not Edit user details");
    }
  };

  // Update user information from server
  const changePassword = async (formData) => {
    try {
      const { old_pass, new_pass } = formData;
      await axios({
        method: "post",
        url: "/api/users/change_password",
        data: { old_pass, new_pass },
      });
      showMessage("success", "Password changed successfully");
      return true;
    } catch (err) {
      showMessage("error", "Could not change password");
      return false;
    }
  };

  // Logout current user
  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
      setUser({});
      clearDeliveries();
      typeof window !== "undefined" && navigate("/login");
    } catch (err) {
      showMessage("error", "Could not logout successfully");
    }
  };

  // Set global previous url to track redirect for login page
  const setURL = (url) =>
    dispatch({
      type: SET_URL,
      payload: url,
    });

  // Calculate price  of a particular delivery
  const calcPrice = async ({ from, to, mode }) => {
    try {
      const res = await axios({
        method: "post",
        url: "/api/delivery/calc",
        data: { from, to, mode },
      });
      return res.data;
    } catch (err) {
      let errorMessage;
      if (err.response.status === 401) {
        logout();
        errorMessage = "Please Login to validate your credentials";
      } else {
        errorMessage =
          "There was an error processing your request, please try again.";
      }
      showMessage("error", errorMessage);
    }
  };

  // Set Modes
  const setModes = (modes) =>
    dispatch({
      type: SET_MODES,
      payload: modes,
    });

  // Apply coupon list to price
  const applyCoupons = async (price, coupons) => {
    try {
      const res = await axios({
        method: "post",
        url: "/api/delivery/coupon",
        data: { price, coupons },
      });
      return res.data;
    } catch (err) {
      showMessage("error", "Invalid discount coupons");
      return { price: 0, error: true };
    }
  };

  // Place Order
  const placeOrder = async (order) => {
    try {
      await axios({
        method: "post",
        url: "/api/delivery",
        data: order,
      });
      return true;
    } catch (err) {
      showMessage("error", "Error! Please contact the Support Team");
      return false;
    }
  };

  React.useEffect(() => {
    if (isLoggedIn()) {
      getDeliveries();
      getNotifications();
    }
    // eslint-disable-next-line
  }, [state.user]);

  return (
    <UserContext.Provider
      {...rest}
      value={{
        user: state.user,
        loading: state.loading,
        url: state.url,
        firstName:
          state.user && state.user.name && state.user.name.split(" ")[0],
        modes: state.modes,
        setURL,
        setModes,
        handleLogin,
        handleRegister,
        loadUser,
        updateUser,
        editUser,
        changePassword,
        isLoggedIn,
        calcPrice,
        applyCoupons,
        placeOrder,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
