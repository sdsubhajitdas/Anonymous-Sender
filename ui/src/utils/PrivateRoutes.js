import { Outlet, Navigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";

export default function PrivateRoutes() {
  let { authentication } = useAuthentication();

  return authentication.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
