import { Link } from "react-router-dom";

export default function Sobre() {
  return (
    <div>
   {/*<img src="" alt="background" className="background" />*/}

      <div className="overlay"></div>

      <div className="content">
        <h1 className="titulo">
          Bem-vindo à <br />
          <strong className="destaque">Arena Beach</strong>
        </h1>

        <p className="descricao">
          Seu espaço para reservar quadras, participar de torneios e viver o esporte.
        </p>

        <div className="secao">
          <h3>Sobre nós</h3>
          <p>
            A Arena Beach é um espaço ideal para quem ama esportes de areia.
            Aqui você encontra quadras de beach tênis, vôlei e futevôlei,
            além de eventos e uma estrutura completa para aproveitar com os amigos.
          </p>
        </div>

        <div className="secao">
          <h3>Horário de funcionamento</h3>
          <p>
            Segunda a sexta: 08h às 22h <br />
            Sábado e domingo: 08h às 18h
          </p>
        </div>

        <div className="secao">
          <h3>Suporte</h3>
          <p>(14) 99681-9354</p>
        </div>

        <div className="secao">
          <h3>Endereço</h3>
          <p>Rua Exemplo, 123 - Tupã/SP - 17600-000</p>
        </div>

        <Link to="/" className="link-destaque">
          Voltar
        </Link>
      </div>
    </div>
  );
}