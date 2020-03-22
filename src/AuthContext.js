import { createContext } from "react";
import { navigate } from "@reach/router";

const blankState = { id: "", email: "", accessToken: "" };

const AuthContext = createContext([blankState, () => {}]);

export const deauthorize = (setAuth) => {
  setAuth(blankState);

  localStorage.removeItem("id");
  localStorage.removeItem("email");
  localStorage.removeItem("accessToken");

  navigate("/signin");
};

export const validAuth = (auth) => {
  return auth.id && auth.email && auth.accessToken;
};

export default AuthContext;
