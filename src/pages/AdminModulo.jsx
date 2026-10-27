import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  FaBorderAll,
  FaChartBar,
  FaCog,
  FaRegCalendarAlt,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import styles from "../styles/administrador.module.css";

const apiUrl = (path) =>
  `${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}${path}`;

// Converte a quadra que vem do back-end (GET /quadras) para uma linha da lista
function quadraParaLinha(quadra) {
  return {
    id: quadra.id,
    name: quadra.nome,
    detail: quadra.tipo,
    role: `R$ ${Number(quadra.valor).toFixed(2).replace(".", ",")}`,
    status: quadra.disponivel ? "Disponível" : "Indisponível",
    disponivel: quadra.disponivel,
  };
}

const moduleData = {
  usuarios: {
    icon: <FaUsers />,
    title: "Usuários",
    description: "Gerencie os acessos e os perfis cadastrados no sistema.",
    action: "Adicionar usuário",
    placeholder: "Nome do novo usuário",
    rows: [
      {
        name: "Mariana Souza",
        detail: "mariana@email.com",
        role: "Administrador",
        status: "Ativo",
      },
      {
        name: "Carlos Oliveira",
        detail: "carlos@email.com",
        role: "Cliente",
        status: "Ativo",
      },
      {
        name: "Fernanda Lima",
        detail: "fernanda@email.com",
        role: "Cliente",
        status: "Pendente",
      },
    ],
  },
  quadras: {
    icon: <FaBorderAll />,
    title: "Quadras",
    description:
      "Controle as quadras disponíveis, modalidades e situação de uso.",
    // As quadras vêm do banco de dados (GET /quadras), não de dados fixos
    usaBanco: true,
    rows: [],
  },
  agendamentos: {
    icon: <FaRegCalendarAlt />,
    title: "Agendamentos",
    description:
      "Acompanhe as reservas e mantenha a agenda das quadras organizada.",
    action: "Adicionar agendamento",
    placeholder: "Nome do novo agendamento",
    rows: [
      {
        name: "Quadra 1",
        detail: "17/02/2026 · 11:00 - 12:00",
        role: "Mariana Souza",
        status: "Confirmado",
      },
      {
        name: "Quadra 2",
        detail: "18/02/2026 · 14:00 - 15:00",
        role: "Carlos Oliveira",
        status: "Pendente",
      },
      {
        name: "Quadra 1",
        detail: "19/02/2026 · 18:00 - 19:00",
        role: "Fernanda Lima",
        status: "Confirmado",
      },
    ],
  },
  torneios: {
    icon: <FaTrophy />,
    title: "Torneios",
    description:
      "Organize competições, acompanhe inscrições e atualize os eventos.",
    action: "Adicionar torneio",
    placeholder: "Nome do novo torneio",
    rows: [
      {
        name: "Arena Open",
        detail: "Beach Tennis · 22/02/2026",
        role: "16 inscritos",
        status: "Inscrições abertas",
      },
      {
        name: "Copa Verão",
        detail: "Futevôlei · 01/03/2026",
        role: "8 inscritos",
        status: "Em preparação",
      },
    ],
  },
};

const reportData = [
  {
    value: "128",
    label: "Reservas no mês",
    detail: "+18% em relação ao mês anterior",
  },
  {
    value: "86%",
    label: "Taxa de ocupação",
    detail: "Melhor horário: 18h às 20h",
  },
  { value: "42", label: "Usuários ativos", detail: "6 novos nesta semana" },
];

function getStatusClass(status) {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus.includes("indisponível")) {
    return styles.statusDanger;
  }
  if (
    normalizedStatus.includes("manutenção") ||
    normalizedStatus.includes("pendente") ||
    normalizedStatus.includes("preparação")
  ) {
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
  const usaBanco = Boolean(config?.usaBanco);
  const [carregando, setCarregando] = useState(usaBanco);
  const [erroBanco, setErroBanco] = useState("");
  const [salvandoId, setSalvandoId] = useState(null);

  // Busca todas as quadras (disponíveis e indisponíveis) no back-end
  useEffect(() => {
    if (!usaBanco) return undefined;
    let ativo = true;

    setCarregando(true);
    fetch(apiUrl("/quadras?disponivel=todos&limit=100"))
      .then(async (resposta) => {
        const resultado = await resposta.json().catch(() => null);
        if (!resposta.ok || !resultado?.sucesso) {
          throw new Error(resultado?.mensagem || "Não foi possível carregar as quadras.");
        }
        return resultado.dados;
      })
      .then((dados) => {
        if (!ativo) return;
        setRows(dados.map(quadraParaLinha));
        setErroBanco("");
      })
      .catch((error) => {
        if (!ativo) return;
        setErroBanco(
          error.message === "Failed to fetch"
            ? "Não foi possível conectar ao servidor. Verifique se o backend está iniciado."
            : error.message,
        );
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usaBanco]);

  if (!config && modulo !== "relatorios" && modulo !== "configuracoes") {
    return <Navigate to="/administrador" replace />;
  }

  const currentTitle =
    config?.title || (modulo === "relatorios" ? "Relatórios" : "Configurações");
  const currentIcon =
    config?.icon || (modulo === "relatorios" ? <FaChartBar /> : <FaCog />);
  const currentDescription =
    config?.description ||
    (modulo === "relatorios"
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
    setRows((currentRows) =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, status: row.status === "Ativo" ? "Inativo" : "Ativo" }
          : row,
      ),
    );
  };

  // Deixa a quadra disponível ou indisponível no banco (PATCH /quadras/:id).
  // Só muda o status: nenhuma quadra é apagada.
  const alterarDisponibilidade = async (row) => {
    const ficaDisponivel = !row.disponivel;
    setSalvandoId(row.id);
    setNotice("");
    setErroBanco("");

    try {
      const resposta = await fetch(apiUrl(`/quadras/${row.id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token_admin") || ""}`,
        },
        body: JSON.stringify({
          status_qd: ficaDisponivel ? "disponivel" : "indisponivel",
        }),
      });
      const resultado = await resposta.json().catch(() => null);

      if (!resposta.ok || !resultado?.sucesso) {
        throw new Error(resultado?.mensagem || "Não foi possível atualizar a quadra.");
      }

      setRows((currentRows) =>
        currentRows.map((item) =>
          item.id === row.id
            ? {
                ...item,
                disponivel: ficaDisponivel,
                status: ficaDisponivel ? "Disponível" : "Indisponível",
              }
            : item,
        ),
      );
      setNotice(
        `${row.name} agora está ${ficaDisponivel ? "disponível" : "indisponível"}.`,
      );
    } catch (error) {
      setErroBanco(
        error.message === "Failed to fetch"
          ? "Não foi possível conectar ao servidor. Verifique se o backend está iniciado."
          : error.message,
      );
    } finally {
      setSalvandoId(null);
    }
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
          <section
            className={styles.reportGrid}
            aria-label="Indicadores do sistema"
          >
            {reportData.map((report) => (
              <article className={styles.reportCard} key={report.label}>
                <span>{report.label}</span>
                <strong>{report.value}</strong>
                <small>{report.detail}</small>
              </article>
            ))}
            <article
              className={`${styles.modulePanel} ${styles.reportHighlight}`}
            >
              <div>
                <span className={styles.panelEyebrow}>DESEMPENHO</span>
                <h2>O movimento da Arena está crescendo</h2>
                <p>
                  Use os dados de reservas para planejar horários, torneios e a
                  disponibilidade das quadras.
                </p>
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
                  <small>
                    Receber avisos quando uma nova reserva for criada.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(event) => setNotifications(event.target.checked)}
                />
              </label>
              <label className={styles.settingRow}>
                <span>
                  <strong>Modo de manutenção</strong>
                  <small>
                    Bloquear novas reservas temporariamente para ajustes.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={maintenance}
                  onChange={(event) => setMaintenance(event.target.checked)}
                />
              </label>
            </div>
            <button
              type="button"
              className={styles.moduleButton}
              onClick={() => setNotice("Configurações salvas com sucesso.")}
            >
              {notice || "Salvar configurações"}
            </button>
          </section>
        )}

        {config && (
          <section className={styles.modulePanel}>
            <div className={styles.moduleToolbar}>
              <div>
                <span className={styles.panelEyebrow}>VISÃO GERAL</span>
                <h2>
                  {carregando
                    ? "Carregando..."
                    : `${rows.length} registros cadastrados`}
                </h2>
              </div>
              {config.action && (
                <button
                  type="button"
                  className={styles.moduleButton}
                  onClick={() => setShowForm((current) => !current)}
                >
                  {showForm ? "Cancelar" : config.action}
                </button>
              )}
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
                <button type="submit" className={styles.moduleButton}>
                  Salvar
                </button>
              </form>
            )}

            <div className={styles.recordsList}>
              {rows.map((row, index) => (
                <article
                  className={styles.recordRow}
                  key={`${row.name}-${index}`}
                >
                  <div>
                    <strong>{row.name}</strong>
                    <span>{row.detail}</span>
                  </div>
                  <span className={styles.recordRole}>{row.role}</span>
                  <span
                    className={`${styles.status} ${getStatusClass(row.status)}`}
                  >
                    {row.status}
                  </span>
                  {modulo === "usuarios" && (
                    <button
                      type="button"
                      className={styles.rowButton}
                      onClick={() => toggleRowStatus(index)}
                    >
                      Alterar status
                    </button>
                  )}
                  {usaBanco && (
                    <button
                      type="button"
                      className={styles.rowButton}
                      onClick={() => alterarDisponibilidade(row)}
                      disabled={salvandoId === row.id}
                    >
                      {salvandoId === row.id
                        ? "Salvando..."
                        : row.disponivel
                          ? "Deixar indisponível"
                          : "Deixar disponível"}
                    </button>
                  )}
                </article>
              ))}
            </div>
            {erroBanco && (
              <p className={styles.errorMessage} role="alert">
                {erroBanco}
              </p>
            )}
            {notice && <p className={styles.successMessage}>{notice}</p>}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminModulo;
