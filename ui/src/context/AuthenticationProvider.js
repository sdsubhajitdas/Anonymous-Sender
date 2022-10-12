import { useState, createContext, useEffect } from "react";
import axios from "../api/axios";
import * as _ from "lodash";

const AuthenticationContext = createContext({});

export function AuthenticationProvider({ children }) {
  let [authentication, setAuthentication] = useState({
    isAuthenticated: false,
    user: null,
  });

  const refresh = async () => {
    let response = await axios.get("/users/refresh");
    if (!_.isEmpty(response)) {
      setAuthentication((previous) => ({
        ...previous,
        isAuthenticated: true,
        user: response.data,
      }));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{ authentication, setAuthentication }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationContext;
