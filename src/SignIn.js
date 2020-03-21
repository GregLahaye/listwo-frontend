import React, { useContext, useState } from "react";
import AuthContext from "./AuthContext";
import { navigate } from "@reach/router";

const SignIn = () => {
  const [, setAuth] = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    fetch("http://localhost:8080/signin", {
      method: "POST",
      body: form,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw response;
      })
      .then((data) => {
        const { id, email, accessToken } = data;

        setAuth({ id, email, accessToken });

        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("accessToken", accessToken);

        navigate("/lists");
      })
      .catch((err) => {
        if (err.status == 401) {
          setError("Invalid Credentials");
        } else {
          setError("Unknown Error");
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleSignIn}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <div>
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SignIn;
