import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = (path) =>
  `${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}${path}`;

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenAdmin = localStorage.getItem("token_admin");
    const token = tokenAdmin || localStorage.getItem("token_sessao");

    fetch(
      apiUrl("/auth/logout"),
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ).finally(() => {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token_sessao");
      localStorage.removeItem("administrador");
      localStorage.removeItem("token_admin");
      navigate(tokenAdmin ? "/admin/login" : "/login", { replace: true });
    });
  }, [navigate]);

  return null;
}
