import AuthContext, { validAuth } from "./AuthContext";
import { Link, Redirect, navigate } from "@reach/router";
import React, { useContext, useState } from "react";

const SignIn = ({ location }) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [email, setEmail] = useState(
    (location && location.state && location.state.email) || "",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    fetch(`${process.env.API_URL}/signin`, {
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

  return validAuth(auth) ? (
    <Redirect to="/lists" />
  ) : (
    <main role="main" className="container">
      <h1>Sign in to listwo</h1>
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
          Sign In
        </button>
        <Link to="/signup" className="btn btn-link" state={{ email }}>
          Sign up for an account
        </Link>
      </form>
      <div>
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default SignIn;
