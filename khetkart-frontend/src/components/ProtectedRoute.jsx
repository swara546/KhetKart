// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Usage:
// <ProtectedRoute>                        → must be logged in
// <ProtectedRoute role="vendor">          → must be logged in as vendor
// <ProtectedRoute role="farmer">          → must be logged in as farmer

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect appropriately
  if (role && user.role !== role) {
    if (user.role === "farmer") return <Navigate to="/seller-dashboard" replace />;
    if (user.role === "vendor") return <Navigate to="/products" replace />;
  }

  return children;
}

export default ProtectedRoute;