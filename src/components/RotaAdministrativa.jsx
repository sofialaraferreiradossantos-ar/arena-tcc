import { Navigate, useLocation } from "react-router-dom";

export default function RotaAdministrativa({ children }) {
  const location = useLocation();
  let usuario = null;
  const token = localStorage.getItem("token_admin");

  try {
    usuario = JSON.parse(localStorage.getItem("administrador") || "null");
  } catch {
    localStorage.removeItem("administrador");
  }

  if (usuario?.tipo !== "admin" || !token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
