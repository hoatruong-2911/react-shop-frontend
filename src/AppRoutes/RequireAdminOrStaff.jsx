// src/routes/RequireAdminOrStaff.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdminOrStaff() {
  const role = localStorage.getItem("role");
  if (role === "ADMIN" || role === "STAFF") return <Outlet />;
  return <Navigate to="/" replace />;
}
