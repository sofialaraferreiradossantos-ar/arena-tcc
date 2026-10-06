import styles from "../../styles/home.module.css";

import QuadraCard from "./QuadraCard";

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
        />
      ))}
    </div>
  );
}

export default QuadrasSection;
