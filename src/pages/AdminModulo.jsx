import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import styles from "../styles/administrador.module.css";

const moduleData = {
  usuarios: {
    icon: "👥",
    title: "Usuários",
    description: "Gerencie os acessos e os perfis cadastrados no sistema.",
    action: "Adicionar usuário",
    placeholder: "Nome do novo usuário",
    rows: [
      { name: "Mariana Souza", detail: "mariana@email.com", role: "Administrador", status: "Ativo" },
      { name: "Carlos Oliveira", detail: "carlos@email.com", role: "Cliente", status: "Ativo" },
      { name: "Fernanda Lima", detail: "fernanda@email.com", role: "Cliente", status: "Pendente" },
    ],
  },
  quadras: {
    icon: "▦",
    title: "Quadras",
    description: "Controle as quadras disponíveis, modalidades e situação de uso.",
    action: "Adicionar quadra",
    placeholder: "Nome da nova quadra",
    rows: [
      { name: "Quadra 1", detail: "Beach Tennis", role: "Coberta", status: "Disponível" },
      { name: "Quadra 2", detail: "Futevôlei", role: "Descoberta", status: "Disponível" },
      { name: "Quadra 3", detail: "Beach Tennis", role: "Descoberta", status: "Manutenção" },
    ],
  },
  agendamentos: {
    icon: "📅",
    title: "Agendamentos",
    description: "Acompanhe as reservas e mantenha a agenda das quadras organizada.",
    action: "Adicionar agendamento",
    placeholder: "Nome do novo agendamento",
    rows: [
      { name: "Quadra 1", detail: "17/02/2026 · 11:00 - 12:00", role: "Mariana Souza", status: "Confirmado" },
      { name: "Quadra 2", detail: "18/02/2026 · 14:00 - 15:00", role: "Carlos Oliveira", status: "Pendente" },
      { name: "Quadra 1", detail: "19/02/2026 · 18:00 - 19:00", role: "Fernanda Lima", status: "Confirmado" },
    ],
  },
  torneios: {
    icon: "🏆",
    title: "Torneios",
    description: "Organize competições, acompanhe inscrições e atualize os eventos.",
    action: "Adicionar torneio",
    placeholder: "Nome do novo torneio",
    rows: [
      { name: "Arena Open", detail: "Beach Tennis · 22/02/2026", role: "16 inscritos", status: "Inscrições abertas" },
      { name: "Copa Verão", detail: "Futevôlei · 01/03/2026", role: "8 inscritos", status: "Em preparação" },
    ],
  },
};

const reportData = [
  { value: "128", label: "Reservas no mês", detail: "+18% em relação ao mês anterior" },
  { value: "86%", label: "Taxa de ocupação", detail: "Melhor horário: 18h às 20h" },
  { value: "42", label: "Usuários ativos", detail: "6 novos nesta semana" },
];

function getStatusClass(status) {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus.includes("manutenção") || normalizedStatus.includes("pendente") || normalizedStatus.includes("preparação")) {
    return styles.statusPending;
  }
  return styles.statusSuccess;
}

function AdminModulo() {
  const { modulo } = useParams();
  const config = moduleData[modulo];
  const [rows, setRows] = useState(config?.rows || []);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [notice, setNotice] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  if (!config && modulo !== "relatorios" && modulo !== "configuracoes") {
    return <Navigate to="/administrador" replace />;
  }

  const currentTitle = config?.title || (modulo === "relatorios" ? "Relatórios" : "Configurações");
  const currentIcon = config?.icon || (modulo === "relatorios" ? "📊" : "⚙️");
  const currentDescription = config?.description || (modulo === "relatorios"
    ? "Acompanhe os principais indicadores da Arena Beach."
    : "Personalize o funcionamento e as preferências do sistema.");

  const handleAdd = (event) => {
    event.preventDefault();
    const name = newItem.trim();
    if (!name) return;

    setRows((currentRows) => [
      ...currentRows,
      { name, detail: "Novo cadastro", role: "A definir", status: "Pendente" },
    ]);
    setNewItem("");
    setShowForm(false);
    setNotice(`${currentTitle.slice(0, -1)} adicionado com sucesso.`);
  };

  const toggleRowStatus = (index) => {
    setRows((currentRows) => currentRows.map((row, rowIndex) => (
      rowIndex === index
        ? { ...row, status: row.status === "Ativo" ? "Inativo" : "Ativo" }
        : row
    )));
  };

  return (
    <div className={styles.mainContent}>
      <main className={styles.modulePage}>
        <div className={styles.moduleTopline}>
          <Link to="/administrador">← Voltar ao painel</Link>
          <span>PAINEL ADMINISTRATIVO</span>
        </div>

        <header className={styles.moduleHeading}>
          <span className={styles.moduleIcon}>{currentIcon}</span>
          <div>
            <h1>{currentTitle}</h1>
            <p>{currentDescription}</p>
          </div>
        </header>

        {modulo === "relatorios" && (
          <section className={styles.reportGrid} aria-label="Indicadores do sistema">
            {reportData.map((report) => (
              <article className={styles.reportCard} key={report.label}>
                <span>{report.label}</span>
                <strong>{report.value}</strong>
                <small>{report.detail}</small>
              </article>
            ))}
            <article className={`${styles.modulePanel} ${styles.reportHighlight}`}>
              <div>
                <span className={styles.panelEyebrow}>DESEMPENHO</span>
                <h2>O movimento da Arena está crescendo</h2>
                <p>Use os dados de reservas para planejar horários, torneios e a disponibilidade das quadras.</p>
              </div>
              <span className={styles.reportTrend}>↗ 18%</span>
            </article>
          </section>
        )}

        {modulo === "configuracoes" && (
          <section className={styles.modulePanel}>
            <div className={styles.settingsList}>
              <label className={styles.settingRow}>
                <span>
                  <strong>Notificações de agendamento</strong>
                  <small>Receber avisos quando uma nova reserva for criada.</small>
                </span>
                <input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} />
              </label>
              <label className={styles.settingRow}>
                <span>
                  <strong>Modo de manutenção</strong>
                  <small>Bloquear novas reservas temporariamente para ajustes.</small>
                </span>
                <input type="checkbox" checked={maintenance} onChange={(event) => setMaintenance(event.target.checked)} />
              </label>
            </div>
            <button type="button" className={styles.moduleButton} onClick={() => setNotice("Configurações salvas com sucesso.")}>
              {notice || "Salvar configurações"}
            </button>
          </section>
        )}

        {config && (
          <section className={styles.modulePanel}>
            <div className={styles.moduleToolbar}>
              <div>
                <span className={styles.panelEyebrow}>VISÃO GERAL</span>
                <h2>{rows.length} registros cadastrados</h2>
              </div>
              <button type="button" className={styles.moduleButton} onClick={() => setShowForm((current) => !current)}>
                {showForm ? "Cancelar" : config.action}
              </button>
            </div>

            {showForm && (
              <form className={styles.moduleForm} onSubmit={handleAdd}>
                <input
                  value={newItem}
                  onChange={(event) => setNewItem(event.target.value)}
                  placeholder={config.placeholder}
                  aria-label={config.placeholder}
                  autoFocus
                />
                <button type="submit" className={styles.moduleButton}>Salvar</button>
              </form>
            )}

            <div className={styles.recordsList}>
              {rows.map((row, index) => (
                <article className={styles.recordRow} key={`${row.name}-${index}`}>
                  <div>
                    <strong>{row.name}</strong>
                    <span>{row.detail}</span>
                  </div>
                  <span className={styles.recordRole}>{row.role}</span>
                  <span className={`${styles.status} ${getStatusClass(row.status)}`}>{row.status}</span>
                  {modulo === "usuarios" && (
                    <button type="button" className={styles.rowButton} onClick={() => toggleRowStatus(index)}>
                      Alterar status
                    </button>
                  )}
                </article>
              ))}
            </div>
            {notice && <p className={styles.successMessage}>{notice}</p>}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminModulo;
