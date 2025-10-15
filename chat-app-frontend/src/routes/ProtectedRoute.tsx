
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useCurrentToken } from "../redux/features/auth/authSlice";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useSelector(useCurrentToken);

  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
};

export default ProtectedRoute;