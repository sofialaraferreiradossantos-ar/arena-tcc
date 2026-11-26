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
  FaMapMarkerAlt,
  FaVolleyballBall,
  FaVenusMars,
} from "react-icons/fa";

import styles from "../styles/torneioDetalhes.module.css";

import { CATEGORIAS_CLIENTE, NIVEIS } from "../mockup/torneios.js";
import {
  buscarEquipes,
  buscarTorneio,
  formatarValor,
} from "../services/torneios.js";

const listarComE = (itens) =>
  `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;

function TorneioDetalhes() {
  const { id } = useParams();

  // Torneio do banco de dados (GET /torneios)
  const [torneio, setTorneio] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  // Equipes cadastradas pelo administrador
  const [equipes, setEquipes] = useState([]);

  useEffect(() => {
    Promise.all([buscarTorneio(id), buscarEquipes(id)])
      .then(([encontrado, lista]) => {
        setTorneio(encontrado);
        setEquipes(lista);
      })
      .catch((error) => setErro(error.message))
      .finally(() => setCarregando(false));
  }, [id]);

  const temEquipeComVaga = equipes.some((equipe) => equipe.vagas > 0);

  if (carregando || erro || !torneio) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <h2>
            {carregando
              ? "Carregando torneio..."
              : erro || "Torneio não encontrado"}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
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
            <FaVolleyballBall />

            <span>
              <strong>Modalidade</strong>

              {torneio.modalidade || "A definir"}
            </span>
          </div>

          <div>
            <FaVenusMars />

            <span>
              <strong>Categoria</strong>

              {torneio.categoria || "Aberta a todos"}
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

              {torneio.vagasTexto} · equipes de {torneio.integrantesPorEquipe}{" "}
              {torneio.integrantesPorEquipe === 1 ? "integrante" : "integrantes"}
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
              <strong>Níveis dos jogadores</strong>

              {listarComE(NIVEIS)}
            </span>
          </div>

          <div>
            <FaTags />

            <span>
              <strong>Categorias dos jogadores</strong>

              {listarComE(CATEGORIAS_CLIENTE)}
            </span>
          </div>
        </div>

        {/* DESCRIÇÃO */}

        <section className={styles.descricao}>
          <h2>Sobre o torneio</h2>

          <p>{torneio.descricao}</p>
        </section>

        {/* EQUIPES */}

        <section className={styles.descricao}>
          <h2>Equipes</h2>

          {equipes.length === 0 ? (
            <p>A organização ainda não cadastrou as equipes deste torneio.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "8px" }}>
              {equipes.map((equipe) => (
                <li key={equipe.id_equipe}>
                  <strong>{equipe.nome_equipe}</strong>
                  {" — "}
                  {equipe.integrantes} de {equipe.limite} integrantes
                  {equipe.vagas > 0
                    ? ` (${equipe.vagas} ${equipe.vagas === 1 ? "vaga" : "vagas"})`
                    : " (completa)"}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* BOTÃO */}

        {torneio.aceitaInscricao && temEquipeComVaga ? (
          <Link
            to={`/inscricao/${torneio.id}`}
            className={styles.inscrever}
          >
            Inscrever-se
          </Link>
        ) : (
          <span className={styles.inscrever} aria-disabled="true" style={{ opacity: 0.6, cursor: "not-allowed" }}>
            {torneio.status !== "aberto"
              ? "Inscrições fechadas"
              : equipes.length === 0
                ? "Equipes ainda não cadastradas"
                : "Vagas esgotadas"}
          </span>
        )}
      </main>
    </div>
  );
}

export default TorneioDetalhes;
