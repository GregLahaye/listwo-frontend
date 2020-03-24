import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState } from "react";
import Route, { AUTHENTICATED, UNAUTHENTICATED } from "./Route";
import AuthContext from "./AuthContext";
import Header from "./Header";
import List from "./List";
import Lists from "./Lists";
import NotFound from "./NotFound";
import { Router } from "@reach/router";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import SignUp from "./SignUp";
import Welcome from "./Welcome";
import { render } from "react-dom";

const App = () => {
  const { id, email, accessToken } = localStorage;
  const auth = useState({ id, email, accessToken });

  return (
    <AuthContext.Provider value={auth}>
      <Header />
      <Router>
        <Route as={Welcome} path="/" redirect={AUTHENTICATED} />
        <Route as={SignUp} path="/signup" redirect={AUTHENTICATED} />
        <Route as={SignIn} path="/signin" redirect={AUTHENTICATED} />
        <Route as={SignOut} path="/signout" redirect={UNAUTHENTICATED} />
        <Route as={Lists} path="/lists" redirect={UNAUTHENTICATED} />
        <Route as={List} path="/lists/:listId" redirect={UNAUTHENTICATED} />
        <NotFound default />
      </Router>
    </AuthContext.Provider>
  );
};

render(<App />, document.getElementById("root"));
