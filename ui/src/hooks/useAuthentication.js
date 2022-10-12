import { useContext } from "react";
import AuthenticationContext from "../context/AuthenticationProvider";

export default function useAuthentication() {
  return useContext(AuthenticationContext);
}
