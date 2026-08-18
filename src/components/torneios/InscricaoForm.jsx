import React, { useState } from 'react';

const InscricaoForm = ({ styles, onPagamento }) => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.telefone) {
      alert('Preencha todos os campos!');
      return;
    }
    if (onPagamento) onPagamento(form);
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Inscrição no Torneio</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="nome">Seu Nome</label>
          <input
            className={styles.input}
            type="text"
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Digite seu nome"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            className={styles.input}
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Digite seu email"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="telefone">Telefone</label>
          <input
            className={styles.input}
            type="tel"
            id="telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </div>
        <button type="submit" className={styles.btnPagamento}>
          Realizar pagamento
        </button>
      </form>
    </div>
  );
};

export default InscricaoForm;
