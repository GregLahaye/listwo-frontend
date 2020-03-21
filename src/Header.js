import { Link } from "@reach/router";
import React from "react";

const Header = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link to="/">
        <span className="navbar-brand mb-0 h1">listwo</span>
      </Link>
    </nav>
  );
};

export default Header;
