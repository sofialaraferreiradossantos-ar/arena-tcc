import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import styles from "../../styles/home.module.css";

export default function Cadastro() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    const dados = new FormData(event.currentTarget);
    const nome = String(dados.get("nome") || "").trim();
    const email = String(dados.get("email") || "")
      .trim()
      .toLowerCase();
    const senha = String(dados.get("senha") || "");
    const confirmarSenha = String(dados.get("confirmarSenha") || "");

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      setCarregando(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";
      const resposta = await fetch(apiUrl + "/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_usu: nome,
          email_usu: email,
          senha_usu: senha,
          status_usu: 1,
          dt_cad: new Date().toISOString().slice(0, 19).replace("T", " "),
        }),
      });

      const resultado = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(
          resultado?.mensagem || "Não foi possível realizar o cadastro.",
        );
      }

      navigate("/login", { replace: true });
    } catch (error) {
      setErro(error.message || "Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.authBrand}>
          <img src={logo} alt="Arena Beach" />
          <strong>
            ARENA <span>BEACH</span>
          </strong>
        </div>

        <div className={styles.authHeading}>
          <small>SEJA BEM-VINDO</small>
          <h1>Crie sua conta</h1>
          <p>Cadastre-se para reservar quadras e participar dos torneios.</p>
        </div>

        <form onSubmit={cadastrar}>
          <label>
            Nome completo
            <input
              name="nome"
              type="text"
              placeholder="Digite seu nome"
              autoComplete="name"
              required
            />
          </label>

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

          <div className={styles.authRow}>
            <label>
              Senha
              <input
                name="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            <label>
              Confirmar senha
              <input
                name="confirmarSenha"
                type="password"
                placeholder="Repita a senha"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>
          </div>

          {erro && <p role="alert">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
