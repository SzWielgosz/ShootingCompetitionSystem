import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ roles }) => {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/" />;
  }

  if (roles && roles.length > 0 && !roles.includes(auth.user.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
