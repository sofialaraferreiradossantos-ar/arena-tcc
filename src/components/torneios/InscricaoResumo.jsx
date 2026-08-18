import React from 'react';

const InscricaoResumo = ({ styles, torneio, onConfirmar }) => {
  return (
    <div className={styles.resumoCard}>
      <h2 className={styles.resumoTitle}>Resumo da inscrição</h2>
      <div className={styles.resumoDetalhes}>
        <p className={styles.resumoQuadra}>{torneio?.quadra || 'Quadra Beach Tennis'}</p>
        <p className={styles.resumoData}>{torneio?.data || '17/02/2026'}</p>

        <div className={styles.premios}>
          <h3 className={styles.premiosTitle}>Prêmios</h3>
          <p className={styles.premioItem}>1º Lugar: R$2.000</p>
          <p className={styles.premioItem}>2º Lugar: R$1.000</p>
          <p className={styles.premioItem}>3º Lugar: R$500</p>
        </div>

        <div className={styles.valor}>
          <p className={styles.valorLabel}>Valor da Inscrição:</p>
          <p className={styles.valorPreco}>R$100</p>
        </div>
      </div>
      <button className={styles.btnConfirmar} onClick={onConfirmar}>
        Confirmar Inscrição
      </button>
    </div>
  );
};

export default InscricaoResumo;
