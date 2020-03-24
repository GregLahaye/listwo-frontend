import AuthContext, { isAuthenticated } from "./AuthContext";
import React, { useContext } from "react";
import { Redirect } from "@reach/router";

export const AUTHENTICATED = "/lists";
export const UNAUTHENTICATED = "/signin";

const Route = ({ as: Component, redirect, ...props }) => {
  const [auth] = useContext(AuthContext);
  const allow =
    (redirect === AUTHENTICATED && !isAuthenticated(auth)) ||
    (redirect === UNAUTHENTICATED && isAuthenticated(auth));

  return allow ? (
    <Component {...props} />
  ) : (
    <Redirect to={redirect} noThrow={true} />
  );
};

export default Route;
