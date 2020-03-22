import React, { useContext } from "react";
import AuthContext from "./AuthContext";
import { Link } from "@reach/router";

const Header = () => {
  const [auth] = useContext(AuthContext);

  return (
    <nav className="navbar navbar-light bg-light">
      <Link to={auth.accessToken ? "/lists" : "/"}>
        <span className="navbar-brand mb-0 h1">listwo</span>
      </Link>
    </nav>
  );
};

export default Header;
