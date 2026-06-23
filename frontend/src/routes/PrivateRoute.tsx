import { Navigate } from "react-router-dom";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("lifehub_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;