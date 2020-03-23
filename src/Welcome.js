import React, { useState } from "react";
import { navigate } from "@reach/router";

const Welcome = () => {
  const [email, setEmail] = useState("");

  const switchToSignUp = (e) => {
    e.preventDefault();

    navigate("/signup", { state: { email } });
  };

  return (
    <main role="main" className="container mt-4">
      <div className="jumbotron">
        <h1>
          listwo
          <small className="text-muted mx-2">a circular to-do list</small>
        </h1>
        <p className="lead">
          listwo makes it easier to stay on top of the tasks you do every week
        </p>
        <form onSubmit={switchToSignUp}>
          <div className="form-row">
            <div className="col-md-4">
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-lg btn-primary">
                Create an account
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Welcome;
