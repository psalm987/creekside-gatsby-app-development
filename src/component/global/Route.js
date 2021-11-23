import React from "react";

const Route = ({ component: Component, location, ...rest }) => {
  return <Component {...rest} />;
};

export default Route;
