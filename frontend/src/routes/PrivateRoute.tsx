import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { getAuthToken } from "../services/authTokenStorageService";

type PrivateRouteProps = {
  children: ReactNode;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;