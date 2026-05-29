import { Link } from "react-router-dom";

export default function Cadastro() {
  return (
    <div className="container">

      <div className="app">

        <div className="topHeader">

          <div className="logoArea">
            {/* <img src="" alt="logo" /> */}

            <h2>
              Criar <span>Conta</span>
            </h2>
          </div>

        </div>

        <div className="quadraCard cadastroCard">

          <h2 className="cadastroTitle">
            Cadastro de usuário
          </h2>

          <input
            type="text"
            placeholder="Nome"
            className="cadastroInput"
          />

          <input
            type="email"
            placeholder="Email"
            className="cadastroInput"
          />

          <input
            type="password"
            placeholder="Senha"
            className="cadastroInput"
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            className="cadastroInput"
          />

          <button className="activeBtn cadastroButton">
            Cadastrar
          </button>

          <p className="cadastroText">
            Já tem conta?{" "}

            <Link
              to="/"
              className="cadastroLink"
            >
              entrar
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}