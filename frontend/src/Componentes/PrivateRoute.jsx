import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  // 🔹 Obtenemos el usuario y token de localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const location = useLocation();

  // 🔒 Si no hay sesión, redirige al login guardando la ruta anterior
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🧩 Normalizamos el rol del usuario y los roles permitidos
  const userRol = user.rol?.toLowerCase().trim();
  const rolesPermitidos = allowedRoles.map((r) => r.toLowerCase().trim());

  // 🚫 Si el rol no está permitido, redirige a inicio
  if (!rolesPermitidos.includes(userRol)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si todo está bien, muestra el contenido protegido
  return children;
};

export default PrivateRoute;
