import React, { useContext, useState } from "react";
import * as _ from "lodash";

const AuthenticationContext = React.createContext();
const AuthenticationUpdateContext = React.createContext();

export function useAuthentication() {
  return useContext(AuthenticationContext);
}

export function useAuthenticationUpdate() {
  return useContext(AuthenticationUpdateContext);
}

export function AuthenticationProvider({ children }) {
  let [authentication, setAuthentication] = useState({
    isAuthenticated: false,
    user: null,
  });

  function toggleAuthentication(user) {
    let updatedAuthenticationObject = {
      isAuthenticated: !_.isEmpty(user),
      user: user,
    };
    setAuthentication(updatedAuthenticationObject);
  }

  return (
    <AuthenticationContext.Provider value={authentication}>
      <AuthenticationUpdateContext.Provider value={toggleAuthentication}>
        {children}
      </AuthenticationUpdateContext.Provider>
    </AuthenticationContext.Provider>
  );
}
