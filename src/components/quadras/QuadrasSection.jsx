import styles from "../../styles/home.module.css";

import QuadraCard from "./QuadraCard";
import { modalidades } from "../../mockup/dados.js";

const nomeDaModalidade = (id) =>
  modalidades.find((item) => item.id === id)?.label;

function QuadrasSection({ quadras }) {
  return (
    <div className={styles.quadrasSection}>
      {quadras.map((quadra) => (
        <QuadraCard
          key={quadra.id}
          id={quadra.id}
          title={quadra.title}
          image={quadra.image}
          available={quadra.available}
          location={`${quadra.cidade} - ${quadra.uf}`}
          modalidade={nomeDaModalidade(quadra.modalidade)}
          destaques={quadra.destaques}
        />
      ))}
    </div>
  );
}

export default QuadrasSection;
