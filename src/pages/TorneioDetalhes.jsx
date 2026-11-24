import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaFlag,
  FaTrophy,
  FaUsers,
  FaMoneyBillWave,
  FaLayerGroup,
  FaTags,
} from "react-icons/fa";

import styles from "../styles/torneioDetalhes.module.css";

import { CATEGORIAS_CLIENTE, NIVEIS } from "../mockup/torneios.js";
import { buscarTorneio, formatarValor } from "../services/torneios.js";

const listarComE = (itens) =>
  `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;

function TorneioDetalhes() {
  const { id } = useParams();

  // Torneio do banco de dados (GET /torneios)
  const [torneio, setTorneio] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarTorneio(id)
      .then(setTorneio)
      .catch((error) => setErro(error.message))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando || erro || !torneio) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <h2>
            {carregando
              ? "Carregando torneio..."
              : erro || "Torneio não encontrado"}
          </h2>

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
            <FaFlag />

            <span>
              <strong>Situação</strong>

              {torneio.statusTexto}
            </span>
          </div>

          <div>
            <FaUsers />

            <span>
              <strong>Vagas</strong>

              {torneio.vagasTexto}
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

        {torneio.aceitaInscricao ? (
          <Link
            to={`/inscricao/${torneio.id}`}
            className={styles.inscrever}
          >
            Inscrever-se
          </Link>
        ) : (
          <span className={styles.inscrever} aria-disabled="true" style={{ opacity: 0.6, cursor: "not-allowed" }}>
            {torneio.status === "aberto" ? "Vagas esgotadas" : "Inscrições fechadas"}
          </span>
        )}
      </main>
    </div>
  );
}

export default TorneioDetalhes;
