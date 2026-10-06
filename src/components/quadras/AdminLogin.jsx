import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import styles from "../../styles/home.module.css";

const apiUrl = (path) =>
  `${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}${path}`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    const dados = new FormData(event.currentTarget);
    const email = String(dados.get("email") || "")
      .trim()
      .toLowerCase();
    const senha = String(dados.get("senha") || "");

    try {
      const resposta = await fetch(apiUrl("/auth/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const resultado = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(resultado?.mensagem || "Não foi possível realizar o login administrativo.");
      }

      localStorage.removeItem("usuario");
      localStorage.removeItem("token_sessao");
      localStorage.setItem("administrador", JSON.stringify(resultado.usuario));
      localStorage.setItem("token_admin", resultado.token);

      const destino = location.state?.from?.startsWith("/administrador")
        ? location.state.from
        : "/administrador";
      navigate(destino, { replace: true, state: null });
    } catch (error) {
      const mensagem =
        error.message === "Failed to fetch"
          ? "Não foi possível conectar ao servidor. Verifique se o backend está iniciado."
          : error.message;
      setErro(mensagem || "Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <section className={`${styles.authCard} ${styles.authCardSmall}`}>
        <div className={styles.authBrand}>
          <img src={logo} alt="Arena Beach" />
          <strong>
            ARENA <span>BEACH</span>
          </strong>
        </div>

        <div className={styles.authHeading}>
          <small>ÁREA ADMINISTRATIVA</small>
          <h1>Entre no painel administrativo</h1>
          <p>Use uma conta administrativa para gerenciar a Arena Beach.</p>
        </div>

        <form onSubmit={entrar}>
          <label>
            E-mail administrativo
            <input
              name="email"
              type="email"
              placeholder="admin@arena-beach.com"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Senha
            <input
              name="senha"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </label>

          {erro && <p role="alert">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Verificando..." : "Entrar como administrador"}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Ainda não tem conta administrativa? <Link to="/admin/cadastro">Cadastre-se</Link>
        </p>

        <p className={styles.authSwitch}>
          É cliente? <Link to="/login">Entrar na área do cliente</Link>
        </p>
      </section>
    </main>
  );
}
