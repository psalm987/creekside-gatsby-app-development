import React from "react";
import { navigate } from "gatsby";
import userContext from "../../state/user/userContext";

const PrivateRoute = ({ children, location, ...rest }) => {
  const { isLoggedIn, setURL } = React.useContext(userContext);
  React.useEffect(() => {
    if (
      !isLoggedIn() &&
      location.pathname !== `/login` &&
      typeof window !== "undefined"
    ) {
      setURL(location.pathname);
      navigate("/login");
    }
    //eslint-disable-next-line
  }, [location.pathname]);
  if (!isLoggedIn()) return null;

  return <React.Fragment {...rest}>{children}</React.Fragment>;
};

export default PrivateRoute;
