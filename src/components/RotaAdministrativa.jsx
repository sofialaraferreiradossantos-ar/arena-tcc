import { Navigate } from "react-router-dom";

export default function RotaAdministrativa({ children }) {
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    localStorage.removeItem("usuario");
  }

  if (usuario?.tipo !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
