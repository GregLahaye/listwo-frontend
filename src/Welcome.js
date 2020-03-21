import { Link } from "@reach/router";
import React from "react";

const Welcome = () => {
  return (
    <div>
      <p>Welcome!</p>
      <Link to="/lists">Lists</Link>
    </div>
  );
};

export default Welcome;
