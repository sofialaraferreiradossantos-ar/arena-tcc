import {
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  Link,
} from "react-router-dom";

import styles from "../../styles/torneios.module.css";

function TorneioCard({
  id,
  nome,
  data,
  local,
  imagem,
}) {
  return (
    <div className={styles.card}>

      {/* TEXTO À ESQUERDA */}
      <div className={styles.cardInfo}>

        <h3>
          {nome}
        </h3>

        <p>
          <FaCalendarAlt />

          <span>
            Data: {data}
          </span>
        </p>

        <p>
          <FaMapMarkerAlt />

          <span>
            {local}
          </span>
        </p>

        {/* BOTÃO VER DETALHES */}
        <Link
          to={`/torneio/${id}`}
          className={styles.detalhesButton}
        >
          Ver Detalhes
        </Link>

      </div>

      {/* IMAGEM À DIREITA */}
      <div className={styles.cardRight}>

        <img
          src={imagem}
          alt={nome}
        />

      </div>

    </div>
  );
}

export default TorneioCard;