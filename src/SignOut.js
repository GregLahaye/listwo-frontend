import AuthContext, { signOut } from "./AuthContext";
import React, { useContext, useEffect } from "react";
import { Link } from "@reach/router";

const SignOut = () => {
  const [, setAuth] = useContext(AuthContext);

  useEffect(() => {
    signOut(setAuth);
  }, []);

  return (
    <main role="main" className="container mt-4">
      <div className="jumbotron">
        <h3>You&apos;ve signed out</h3>
        <Link to="/">Back to home</Link>
      </div>
    </main>
  );
};

export default SignOut;
