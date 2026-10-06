import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import styles from "../../styles/home.module.css";

const apiUrl = (path) =>
  `${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}${path}`;

export default function AdminCadastro() {
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

    if (nome.length > 100 || email.length > 100 || senha.length > 20) {
      setErro("Nome e e-mail podem ter até 100 caracteres; a senha, até 20.");
      setCarregando(false);
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch(apiUrl("/auth/admin/cadastro"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_adm: nome, email_adm: email, senha_adm: senha }),
      });
      const resultado = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(resultado?.mensagem || "Não foi possível realizar o cadastro administrativo.");
      }

      navigate("/admin/login", { replace: true });
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
      <section className={styles.authCard}>
        <div className={styles.authBrand}>
          <img src={logo} alt="Arena Beach" />
          <strong>
            ARENA <span>BEACH</span>
          </strong>
        </div>

        <div className={styles.authHeading}>
          <small>ÁREA ADMINISTRATIVA</small>
          <h1>Cadastre um administrador</h1>
          <p>Crie uma conta separada para acessar o painel da Arena Beach.</p>
        </div>

        <form onSubmit={cadastrar}>
          <label>
            Nome completo
            <input
              name="nome"
              type="text"
              placeholder="Digite seu nome"
              autoComplete="name"
              maxLength={100}
              required
            />
          </label>

          <label>
            E-mail administrativo
            <input
              name="email"
              type="email"
              placeholder="admin@arena-beach.com"
              autoComplete="email"
              maxLength={100}
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
                maxLength={20}
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
                maxLength={20}
                required
              />
            </label>
          </div>

          {erro && <p role="alert">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Criar conta administrativa"}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Já tem uma conta administrativa? <Link to="/admin/login">Entrar</Link>
        </p>

        <p className={styles.authSwitch}>
          Quer uma conta de cliente? <Link to="/cadastro">Cadastrar cliente</Link>
        </p>
      </section>
    </main>
  );
}
