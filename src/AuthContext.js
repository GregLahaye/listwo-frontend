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

export const isAuthenticated = (auth) => {
  return !!(auth.id && auth.email && auth.accessToken);
};

export const request = (method, endpoint, { params, form, auth }) => {
  const url = new URL(`${process.env.API_URL}/${endpoint}`);

  if (params) {
    for (const name in params) {
      url.searchParams.set(name, params[name]);
    }
  }

  const options = { method };

  if (auth && auth.accessToken) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);
    options.headers = headers;
  }

  if (form) {
    const body = new FormData();

    for (const name in form) {
      body.append(name, form[name]);
    }

    options.body = body;
  }

  return fetch(url, options).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw response;
  });
};

export default AuthContext;
