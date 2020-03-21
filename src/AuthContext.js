import { createContext } from "react";

const AuthContext = createContext([
  { id: "", email: "", accessToken: "" },
  () => {},
]);

export default AuthContext;
