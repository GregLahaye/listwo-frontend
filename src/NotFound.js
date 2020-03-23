import { Link } from "@reach/router";
import React from "react";

const NotFound = () => {
  return (
    <main role="main" className="container mt-4">
      <div className="jumbotron">
        <h3>Page not found</h3>
        <Link to="/">Back to home</Link>
      </div>
    </main>
  );
};

export default NotFound;
