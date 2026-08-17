import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy,
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

    <article
      className={styles.card}
    >

      {/* INFORMAÇÕES */}

      <div
        className={styles.cardInfo}
      >

        <div
          className={styles.cardTitle}
        >

          <div
            className={styles.trophyIcon}
          >
            <FaTrophy />
          </div>

          <div>

            <span
              className={styles.cardLabel}
            >
              TORNEIO
            </span>

            <h2>
              {nome}
            </h2>

          </div>

        </div>


        {/* DATA */}

        <div
          className={styles.infoItem}
        >

          <div
            className={styles.infoIcon}
          >
            <FaCalendarAlt />
          </div>

          <div>

            <span>
              Data
            </span>

            <strong>
              {data}
            </strong>

          </div>

        </div>


        {/* LOCAL */}

        <div
          className={styles.infoItem}
        >

          <div
            className={styles.infoIcon}
          >
            <FaMapMarkerAlt />
          </div>

          <div>

            <span>
              Local
            </span>

            <strong>
              {local}
            </strong>

          </div>

        </div>


        {/* BOTÃO */}

        <Link
          to={`/torneio/${id}`}
          className={
            styles.detalhesButton
          }
        >
          Ver detalhes
        </Link>

      </div>


      {/* IMAGEM */}

      <div
        className={styles.cardRight}
      >

        <img
          src={imagem}
          alt={nome}
        />

      </div>

    </article>

  );
}


export default TorneioCard;