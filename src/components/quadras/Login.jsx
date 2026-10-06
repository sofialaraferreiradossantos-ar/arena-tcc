import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import styles from "../../styles/home.module.css";

const apiUrl = (path) =>
  `${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}${path}`;

export default function Login() {
  const navigate = useNavigate();
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
      const resposta = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const resultado = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(resultado?.mensagem || "Não foi possível realizar o login.");
      }

      localStorage.removeItem("administrador");
      localStorage.removeItem("token_admin");
      localStorage.setItem("usuario", JSON.stringify(resultado.usuario));
      localStorage.setItem("token_sessao", resultado.token);
      navigate("/home", { replace: true });
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
          <small>ÁREA DO CLIENTE</small>
          <h1>Entre na sua conta</h1>
          <p>Acesse suas reservas e continue jogando.</p>
        </div>

        <form onSubmit={entrar}>
          <label>
            E-mail
            <input
              name="email"
              type="email"
              placeholder="voce@email.com"
              autoComplete="email"
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

          <Link to="/recuperarSenha" className={styles.forgotLink}>
            Esqueceu a senha?
          </Link>

          {erro && <p role="alert">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>

        <p className={styles.authSwitch}>
          É administrador? <Link to="/admin/login">Acessar área administrativa</Link>
        </p>

        <Link to="/sobre" className={styles.aboutLink}>
          Conheça a Arena Beach
        </Link>
      </section>
    </main>
  );
}
