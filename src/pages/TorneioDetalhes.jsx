import { useParams, Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTrophy,
  FaUsers,
  FaMoneyBillWave,
  FaLayerGroup,
  FaTags,
} from "react-icons/fa";

import styles from "../styles/torneioDetalhes.module.css";

import {
  CATEGORIAS_CLIENTE,
  NIVEIS,
  formatarValor,
  torneiosMckp as torneios,
} from "../mockup/torneios.js";

const listarComE = (itens) =>
  `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;

function TorneioDetalhes() {
  const { id } = useParams();

  const torneio = torneios.find((item) => item.id === Number(id));

  if (!torneio) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <h2>Torneio não encontrado</h2>

          <Link to="/torneios" className={styles.voltar}>
            ← Voltar para torneios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        {/* VOLTAR */}

        <Link to="/torneios" className={styles.voltar}>
          ← Voltar
        </Link>

        {/* IMAGEM */}

        <img
          src={torneio.imagem}
          alt={torneio.nome}
          className={styles.imagem}
        />

        {/* NOME */}

        <h1>{torneio.nome}</h1>

        {/* INFORMAÇÕES */}

        <div className={styles.informacoes}>
          <div>
            <FaCalendarAlt />

            <span>
              <strong>Data</strong>

              {torneio.data}
            </span>
          </div>

          <div>
            <FaMapMarkerAlt />

            <span>
              <strong>Local</strong>

              {torneio.local}
            </span>
          </div>

          <div>
            <FaClock />

            <span>
              <strong>Horário</strong>

              {torneio.horario}
            </span>
          </div>

          <div>
            <FaUsers />

            <span>
              <strong>Participantes</strong>

              {torneio.participantes}
            </span>
          </div>

          <div>
            <FaTrophy />

            <span>
              <strong>Premiação</strong>

              {torneio.premiacao}
            </span>
          </div>

          <div>
            <FaMoneyBillWave />

            <span>
              <strong>Valor da inscrição</strong>

              {formatarValor(torneio.valor)}
            </span>
          </div>

          <div>
            <FaLayerGroup />

            <span>
              <strong>Níveis</strong>

              {listarComE(NIVEIS)}
            </span>
          </div>

          <div>
            <FaTags />

            <span>
              <strong>Categorias</strong>

              {listarComE(CATEGORIAS_CLIENTE)}
            </span>
          </div>
        </div>

        {/* DESCRIÇÃO */}

        <section className={styles.descricao}>
          <h2>Sobre o torneio</h2>

          <p>{torneio.descricao}</p>
        </section>

        {/* BOTÃO */}

        <Link
          to={`/inscricao/${torneio.id}`}
          className={styles.inscrever}
        >
          Inscrever-se
        </Link>
      </main>
    </div>
  );
}

export default TorneioDetalhes;
