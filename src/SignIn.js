import AuthContext, { request } from "./AuthContext";
import { Link, navigate } from "@reach/router";
import React, { useContext, useState } from "react";

const SignIn = ({ location }) => {
  const [, setAuth] = useContext(AuthContext);
  const [email, setEmail] = useState(
    (location && location.state && location.state.email) || "",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();

    request("POST", "signin", { form: { email, password } })
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
    <main role="main" className="container py-3" style={{ width: 400 }}>
      <h1 className="h3 font-weight-normal py-3">Sign in to listwo</h1>
      <form onSubmit={handleSignIn}>
        <div className="form-group">
          <input
            type="email"
            className="form-control form-control-lg"
            id="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control form-control-lg"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-lg btn-primary w-100">
          Sign In
        </button>
        <Link
          to="/signin"
          className="btn btn-link float-right"
          state={{ email }}
        >
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
