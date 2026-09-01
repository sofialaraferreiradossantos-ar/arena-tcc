import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "../styles/inscricao.module.css";

// Dados de exemplo — troque por fetch(`/api/torneios/${id}`) quando o backend estiver pronto
const TORNEIOS_MOCK = {
  1: {
    nome: "Torneio de Verão Arena Beach",
    quadra: "Quadra Beach Tennis",
    data: "17/02/2026",
    vagas: "12 vagas disponíveis",
    valor: 100,
  },
  2: {
    nome: "Copa Futevôlei Arena Beach",
    quadra: "Quadra Futevôlei",
    data: "05/03/2026",
    vagas: "8 vagas disponíveis",
    valor: 80,
  },
};

function InscricaoTorneio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const torneio = TORNEIOS_MOCK[id];

  useEffect(() => {
    // Quando tiver API: fetch(`/api/torneios/${id}`).then(res => res.json()).then(setTorneio)
    if (!torneio) {
      alert("Torneio não encontrado.");
      navigate("/torneios");
      return;
    }

  }, [torneio, navigate]);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nome || !form.email || !form.telefone) {
      alert("Preencha todos os campos!");
      return;
    }

    // Leva para a tela de pagamento com os dados da inscrição
    navigate("/pagamento", {
      state: {
        inscricao: {
          torneioId: id,
          torneio: torneio.nome,
          valor: torneio.valor,
          ...form,
        },
      },
    });
  };

  if (!torneio) return null;

  return (
    <div className={styles.pageWrapper}>

      {/* BOTÃO DE MENU */}
      <button
        type="button"
        className={styles.menuIcon}
        onClick={() => setMenuAberto(true)}
      >
        ☰
      </button>

      {/* OVERLAY + SIDEBAR */}
      {menuAberto && (
        <div
          className={styles.menuOverlay}
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside className={`${styles.sidebarMenu} ${menuAberto ? styles.open : ""}`}>
        <button
          type="button"
          className={styles.closeMenu}
          onClick={() => setMenuAberto(false)}
        >
          ✕
        </button>

        <img src="/logo-arena-beach.png" alt="Arena Beach" />

        <Link to="/home" onClick={() => setMenuAberto(false)}>
          🏠 Início
        </Link>
        <Link to="/quadra" onClick={() => setMenuAberto(false)}>
          📍 Quadras
        </Link>
        <Link to="/agendar-horario" onClick={() => setMenuAberto(false)}>
          🕐 Agendar Horário
        </Link>
        <Link to="/agendamentos" onClick={() => setMenuAberto(false)}>
          📅 Agendamentos
        </Link>
        <Link to="/torneios" className={styles.active} onClick={() => setMenuAberto(false)}>
          🏆 Torneios
        </Link>
        <Link to="/pagamento" onClick={() => setMenuAberto(false)}>
          💳 Pagamento
        </Link>

        <Link to="/login" className={styles.sair} onClick={() => setMenuAberto(false)}>
          🚪 Sair
        </Link>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className={styles.mainContent}>

        <div className={styles.header}>
          <img src="/logo-arena-beach.png" alt="Arena Beach" className={styles.logo} />
          <div>
            <h1>Inscrição no <span>Torneio</span></h1>
            <p>Preencha seus dados para garantir sua vaga.</p>
          </div>
        </div>

        <div className={styles.inscricaoCard}>

          {/* INFORMAÇÕES DO TORNEIO */}
          <div className={styles.torneioInfo}>
            <div className={styles.infoHeader}>
              <div className={styles.trophyIcon}>🏆</div>
              <div>
                <small>TORNEIO</small>
                <h2>{torneio.nome}</h2>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>📍</span>
                <div>
                  <small>Quadra</small>
                  <strong>{torneio.quadra}</strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span>📅</span>
                <div>
                  <small>Data</small>
                  <strong>{torneio.data}</strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span>👥</span>
                <div>
                  <small>Vagas</small>
                  <strong>{torneio.vagas}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form className={styles.formSection} onSubmit={handleSubmit}>
            <h2>Seus dados</h2>
            <p>As informações abaixo serão usadas na sua inscrição.</p>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Digite seu email"
                />
              </div>

              <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            {/* RESUMO DE VALORES */}
            <div className={styles.resumo}>
              <div>
                <span>Valor da inscrição</span>
                <strong>R$ {torneio.valor.toFixed(2).replace(".", ",")}</strong>
              </div>
              <div>
                <span>Taxa de serviço</span>
                <strong>R$ 0,00</strong>
              </div>
              <div className={styles.total}>
                <span>Total</span>
                <strong>R$ {torneio.valor.toFixed(2).replace(".", ",")}</strong>
              </div>
            </div>

            <button type="submit" className={styles.confirmarButton}>
              Confirmar Inscrição
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default InscricaoTorneio;
