import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="page-center">
      {/*<img src="" alt="background" className="background" />*/}

      <div className="card">
        <h2 className="title">Login</h2>

        <input type="email" placeholder="Email" className="input" />

        <div className="password-box">
          <input type="password" placeholder="Senha" className="input" />
        </div>

        <button className="button">Entrar</button>

        <div className="links">
          <p>Esqueceu a senha?</p>
          <p>
            Não tem conta?{" "}
            <Link to="/cadastro" className="link-destaque">
              cadastre-se
            </Link>
          </p>
          <p>
            <Link to="/sobre" className="link-destaque">
              Sobre
            </Link>
          </p>
          <Link to="/Home" className="link-destaque">Home</Link>
        </div>
      </div>
    </div>
  );
}