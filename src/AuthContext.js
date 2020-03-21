import { createContext } from "react";

const AuthContext = createContext([blankState, () => {}]);

export const blankState = { id: "", email: "", accessToken: "" };

export default AuthContext;
