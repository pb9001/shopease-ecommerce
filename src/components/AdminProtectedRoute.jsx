import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminProtectedRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  // User must be logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // User must have admin role
  if (user?.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default AdminProtectedRoute;