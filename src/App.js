import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import React from "react";
import { Router } from "@reach/router";
import Welcome from "./Welcome";
import { render } from "react-dom";

const App = () => {
  return (
    <div>
      <Header />
      <Router>
        <Welcome path="/" />
      </Router>
    </div>
  );
};

render(<App />, document.getElementById("root"));
