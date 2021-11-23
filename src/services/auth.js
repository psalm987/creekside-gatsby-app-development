export const isBrowser = () => typeof window !== "undefined";

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("creeksideGatsbyUser")
    ? JSON.parse(window.localStorage.getItem("creeksideGatsbyUser"))
    : {};

const setUser = (user) =>
  isBrowser() &&
  window.localStorage.setItem("creeksideGatsbyUser", JSON.stringify(user));

export const handleLogin = ({ username, password }) => {
  if (typeof username === "string" && typeof password === "string") {
    if (username.toLowerCase() === `john` && password === `pass`) {
      return setUser({
        username: `john`,
        name: `Johnny`,
        email: `johnny@example.org`,
      });
    }
  }
  return false;
};

export const isLoggedIn = () => {
  const user = getUser();
  return !!user.username;
};

export const logout = (callback) => {
  setUser({});
  callback();
};
