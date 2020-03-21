import React, { useContext, useEffect } from "react";
import AuthContext from "./AuthContext";

const SignOut = () => {
  const [, setAuth] = useContext(AuthContext);

  useEffect(() => {
    setAuth({ id: "", email: "", accessToken: "" });

    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
  }, []);

  return <p>Successfully signed out!</p>;
};

export default SignOut;
