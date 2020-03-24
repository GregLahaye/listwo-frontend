import AuthContext, { isAuthenticated } from "./AuthContext";
import React, { useContext } from "react";
import { Link } from "@reach/router";

const Header = () => {
  const [auth] = useContext(AuthContext);

  return (
    <nav className="navbar navbar-dark bg-dark">
      <Link to={isAuthenticated(auth) ? "/lists" : "/"}>
        <span className="navbar-brand mb-0 h1">listwo</span>
      </Link>
      {isAuthenticated(auth) ? (
        <Link
          to="/signout"
          className="btn btn-secondary mx-1"
          role="button"
          aria-pressed="true"
        >
          Sign Out
        </Link>
      ) : (
        <div>
          <Link
            to="/signin"
            className="btn btn-secondary mx-1"
            role="button"
            aria-pressed="true"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="btn btn-primary mx-1"
            role="button"
            aria-pressed="true"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
