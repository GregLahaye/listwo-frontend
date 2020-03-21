import "bootstrap/dist/css/bootstrap.min.css";
import AuthContext, { blankState } from "./AuthContext";
import React, { useState } from "react";
import Header from "./Header";
import List from "./List";
import Lists from "./Lists";
import { Router } from "@reach/router";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import SignUp from "./SignUp";
import Welcome from "./Welcome";
import { render } from "react-dom";

const App = () => {
  const auth = useState(blankState);

  return (
    <AuthContext.Provider value={auth}>
      <div>
        <Header />
        <Router>
          <Welcome path="/" />
          <SignUp path="/signup" />
          <SignIn path="/signin" />
          <SignOut path="/signout" />
          <Lists path="/lists" />
          <List path="/lists/:listId" />
        </Router>
      </div>
    </AuthContext.Provider>
  );
};

render(<App />, document.getElementById("root"));
