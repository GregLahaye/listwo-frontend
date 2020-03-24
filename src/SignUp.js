import { Link, navigate } from "@reach/router";
import React, { useContext, useState } from "react";
import AuthContext from "./AuthContext";

const SignUp = ({ location }) => {
  const [, setAuth] = useContext(AuthContext);
  const [email, setEmail] = useState(
    (location && location.state && location.state.email) || "",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least eight characters");
      return;
    }

    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    fetch(`${process.env.API_URL}/signup`, {
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
      .catch(() => {
        setError("Unknown Error");
      });
  };

  return (
    <main role="main" className="container py-3" style={{ width: 400 }}>
      <h1 className="h3 font-weight-normal py-3">Sign up for an account</h1>
      <form onSubmit={handleSignUp}>
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
          Sign Up
        </button>
        <Link
          to="/signin"
          className="btn btn-link float-right"
          state={{ email }}
        >
          Already have an account? Sign in instead
        </Link>
      </form>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}
    </main>
  );
};

export default SignUp;
