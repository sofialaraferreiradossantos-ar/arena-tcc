import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token_sessao");

    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3333"}/auth/logout`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ).finally(() => {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token_sessao");
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  return null;
}
