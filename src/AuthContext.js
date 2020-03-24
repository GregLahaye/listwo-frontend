import { createContext } from "react";
import { redirectTo } from "@reach/router";

const blankState = { id: "", email: "", accessToken: "" };

const AuthContext = createContext([blankState, () => {}]);

export const signOut = (setAuth) => {
  setAuth(blankState);

  localStorage.removeItem("id");
  localStorage.removeItem("email");
  localStorage.removeItem("accessToken");
};

export const deauthorize = (setAuth) => {
  signOut(setAuth);

  redirectTo("/signin");
};

export const validAuth = (auth) => {
  return auth.id && auth.email && auth.accessToken;
};

export default AuthContext;
