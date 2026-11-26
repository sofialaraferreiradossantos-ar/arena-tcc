import { useCallback, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  FaBorderAll,
  FaChartBar,
  FaCog,
  FaRegCalendarAlt,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import styles from "../styles/administrador.module.css";
import { requisicaoApi } from "../services/api.js";

const STATUS_AGENDAMENTO = {
  confirmado: "Confirmado",
  pendente: "Aguardando pagamento",
  cancelado: "Cancelado",
};

const STATUS_USUARIO = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  recusado: "Recusado",
};

const STATUS_TORNEIO = {
  aberto: "Inscrições abertas",
  "em breve": "Em breve",
  "em andamento": "Em andamento",
  encerrado: "Encerrado",
  inativo: "Inativo",
};

const reais = (valor) =>
  `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;

const dataBR = (iso) => {
  if (!iso) return "—";
  const [ano, mes, dia] = String(iso).slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
};

// Administrador logado (salvo no login): usado em "Minha conta"
function adminLogado() {
  try {
    return JSON.parse(localStorage.getItem("administrador")) || null;
  } catch {
    return null;
  }
}

// Converte o agendamento do banco (GET /agendamentos) para uma linha da lista,
// mostrando quem fez a reserva
function agendamentoParaLinha(agendamento) {
  const [ano, mes, dia] = agendamento.data.split("-");
  return {
    id: agendamento.id,
    name: agendamento.quadra.nome,
    detail: `${dia}/${mes}/${ano} · ${agendamento.horaInicio} - ${agendamento.horaFim}`,
    role: `Feito por ${agendamento.cliente.nome}`,
    roleDetail: agendamento.cliente.email,
    status: STATUS_AGENDAMENTO[agendamento.status] || agendamento.status,
  };
}

// Converte a quadra que vem do back-end (GET /quadras) para uma linha da lista
function quadraParaLinha(quadra) {
  return {
    id: quadra.id,
    name: quadra.nome,
    detail: quadra.tipo,
    role: reais(quadra.valor),
    status: quadra.disponivel ? "Disponível" : "Indisponível",
    disponivel: quadra.disponivel,
  };
}

// Usuário do banco (GET /usuarios?status=todos)
function usuarioParaLinha(usuario) {
  return {
    id: usuario.id_usu,
    name: usuario.nome_usu,
    detail: usuario.email_usu,
    role: usuario.tipo_usu === "admin" ? "Administrador" : "Cliente",
    roleDetail: `Cadastro em ${dataBR(usuario.dt_cad)}`,
    status: STATUS_USUARIO[usuario.status_usu] || usuario.status_usu,
    statusBanco: usuario.status_usu,
  };
}

// Torneio do banco (GET /torneios)
function torneioParaLinha(torneio) {
  const limite = torneio.limite_part_torn;
  return {
    id: torneio.id_torn,
    name: torneio.nome_torn,
    detail: [
      dataBR(torneio.dt_torn),
      torneio.modalidade_torn,
      torneio.categoria_torn,
      torneio.local_torn,
      torneio.valor_part === null ? "Gratuito" : reais(torneio.valor_part),
    ]
      .filter(Boolean)
      .join(" · "),
    role: limite
      ? `${torneio.inscritos} de ${limite} inscritos`
      : `${torneio.inscritos} inscritos`,
    roleDetail: [`Equipes de ${torneio.integrantes_torn}`, torneio.premiacao_torn].filter(Boolean).join(" · "),
    integrantes: Number(torneio.integrantes_torn),
    status: STATUS_TORNEIO[torneio.status_torn] || torneio.status_torn,
    statusBanco: torneio.status_torn,
  };
}

// Busca os registros do módulo no back-end
const CARREGAR = {
  quadras: () =>
    requisicaoApi("/quadras?disponivel=todos&limit=100").then((resultado) =>
      resultado.dados.map(quadraParaLinha),
    ),
  // Todos os agendamentos feitos pelos clientes (somente admin)
  agendamentos: () =>
    requisicaoApi("/agendamentos", { autenticado: "admin" }).then(
      (resultado) => resultado.dados.map(agendamentoParaLinha),
    ),
  usuarios: () =>
    requisicaoApi("/usuarios?status=todos", { autenticado: "admin" }).then(
      (resultado) => resultado.dados.map(usuarioParaLinha),
    ),
  torneios: () =>
    requisicaoApi("/torneios").then((resultado) =>
      resultado.dados
        .filter((torneio) => torneio.status_torn !== "inativo")
        .map(torneioParaLinha),
    ),
};

// Campos do formulário "Adicionar" de cada módulo
const CAMPOS = {
  usuarios: [
    { name: "nome_usu", placeholder: "Nome completo" },
    { name: "email_usu", placeholder: "E-mail", type: "email" },
    { name: "senha_usu", placeholder: "Senha inicial (6 a 20 caracteres)", type: "password" },
  ],
  torneios: [
    { name: "nome_torn", placeholder: "Nome do torneio", required: true },
    { name: "dt_torn", placeholder: "Data", type: "date", required: true },
    { name: "desc_torn", placeholder: "Descrição", required: true },
    { name: "modalidade_torn", placeholder: "Modalidade", options: ["Futevôlei", "Beach Tennis"], required: true },
    { name: "categoria_torn", placeholder: "Categoria", options: ["Feminino", "Masculino", "Misto"], required: true },
    { name: "local_torn", placeholder: "Local (ex.: Quadra 1)", maxLength: 20, required: true },
    { name: "integrantes_torn", placeholder: "Integrantes por equipe (ex.: 2)", type: "number", required: true },
    { name: "limite_part_torn", placeholder: "Limite de participantes", type: "number" },
    { name: "premiacao_torn", placeholder: "Premiação" },
    { name: "valor_part", placeholder: "Valor da inscrição (R$)", type: "number" },
  ],
};

const moduleData = {
  usuarios: {
    icon: <FaUsers />,
    title: "Usuários",
    description: "Gerencie os acessos e os perfis cadastrados no sistema.",
    action: "Adicionar usuário",
    fonte: "usuarios",
    vazio: "Nenhum usuário cadastrado.",
    rows: [],
  },
  quadras: {
    icon: <FaBorderAll />,
    title: "Quadras",
    description:
      "Controle as quadras disponíveis, modalidades e situação de uso.",
    // As quadras vêm do banco de dados (GET /quadras), não de dados fixos
    fonte: "quadras",
    rows: [],
  },
  agendamentos: {
    icon: <FaRegCalendarAlt />,
    title: "Agendamentos",
    description:
      "Todas as reservas feitas pelos clientes, com quem fez cada uma.",
    // Só aparecem reservas reais: as que os clientes fazem pelo site
    fonte: "agendamentos",
    vazio:
      "Nenhum agendamento ainda. As reservas aparecem aqui quando um cliente agenda uma quadra.",
    rows: [],
  },
  torneios: {
    icon: <FaTrophy />,
    title: "Torneios",
    description:
      "Organize competições, acompanhe inscrições e atualize os eventos.",
    action: "Adicionar torneio",
    fonte: "torneios",
    vazio: "Nenhum torneio cadastrado.",
    rows: [],
  },
};

function getStatusClass(status) {
  const normalizedStatus = String(status).toLowerCase();
  if (
    normalizedStatus.includes("indisponível") ||
    normalizedStatus.includes("cancelado") ||
    normalizedStatus.includes("inativ") ||
    normalizedStatus.includes("recusado") ||
    normalizedStatus.includes("encerrado")
  ) {
    return styles.statusDanger;
  }
  if (
    normalizedStatus.includes("manutenção") ||
    normalizedStatus.includes("pendente") ||
    normalizedStatus.includes("aguardando") ||
    normalizedStatus.includes("preparação") ||
    normalizedStatus.includes("em breve")
  ) {
    return styles.statusPending;
  }
  return styles.statusSuccess;
}

// A "key" recria a tela a cada módulo (/administrador/quadras,
// /administrador/usuarios...), assim o estado de um módulo não vaza para o outro.
function AdminModulo() {
  const { modulo } = useParams();
  return <ConteudoModulo key={modulo} modulo={modulo} />;
}

function ConteudoModulo({ modulo }) {
  const config = moduleData[modulo];
  const [rows, setRows] = useState(config?.rows || []);
  const [showForm, setShowForm] = useState(false);
  const [formDados, setFormDados] = useState({});
  const [notice, setNotice] = useState("");
  // Módulos ligados ao banco: quadras, agendamentos, usuários e torneios
  const fonte = config?.fonte;
  const [carregando, setCarregando] = useState(Boolean(fonte));
  const [erroBanco, setErroBanco] = useState("");
  const [salvandoId, setSalvandoId] = useState(null);
  // Torneios: inscritos do torneio aberto na lista
  const [inscritosDe, setInscritosDe] = useState(null);
  const [equipes, setEquipes] = useState([]);
  // Relatórios e Minha conta
  const [relatorio, setRelatorio] = useState(null);
  const [senhas, setSenhas] = useState({ senhaAtual: "", novaSenha: "" });
  const admin = adminLogado();

  const mensagemErro = (error) =>
    error.precisaLogin
      ? "Sua sessão expirou. Saia e entre novamente no painel."
      : error.message;

  // Busca os registros do módulo no back-end
  const recarregar = useCallback(() => {
    if (!fonte) return Promise.resolve();
    return CARREGAR[fonte]()
      .then((linhas) => {
        setRows(linhas);
        setErroBanco("");
      })
      .catch((error) => setErroBanco(mensagemErro(error)))
      .finally(() => setCarregando(false));
  }, [fonte]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  // Relatórios calculados no banco (GET /relatorios)
  useEffect(() => {
    if (modulo !== "relatorios") return;
    requisicaoApi("/relatorios", { autenticado: "admin" })
      .then((resultado) => setRelatorio(resultado.dados))
      .catch((error) => setErroBanco(mensagemErro(error)));
  }, [modulo]);

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
      : "Dados da sua conta de administrador.");

  const executar = async (id, acao, sucesso) => {
    setSalvandoId(id);
    setNotice("");
    setErroBanco("");
    try {
      await acao();
      setNotice(sucesso);
      await recarregar();
    } catch (error) {
      setErroBanco(mensagemErro(error));
    } finally {
      setSalvandoId(null);
    }
  };

  // "Adicionar usuário" (POST /usuarios) e "Adicionar torneio" (POST /torneios)
  const handleAdd = async (event) => {
    event.preventDefault();
    const dados = { ...formDados };
    let caminho = "/usuarios";
    if (modulo === "torneios") {
      caminho = "/torneios";
      dados.status_torn = "aberto";
      ["limite_part_torn", "valor_part", "premiacao_torn", "modalidade_torn", "categoria_torn", "local_torn"].forEach((campo) => {
        if (dados[campo] === "" || dados[campo] === undefined) dados[campo] = null;
      });
      // Integrantes por equipe (o administrador define em cada torneio)
      if (dados.integrantes_torn === "" || dados.integrantes_torn === undefined) delete dados.integrantes_torn;
      else dados.integrantes_torn = Number(dados.integrantes_torn);
    }
    await executar(
      "novo",
      () => requisicaoApi(caminho, { method: "POST", body: dados, autenticado: "admin" }),
      modulo === "torneios" ? "Torneio cadastrado com sucesso." : "Usuário cadastrado com sucesso.",
    );
    setFormDados({});
    setShowForm(false);
  };

  // Usuários: ativa ou inativa a conta (PATCH /usuarios/:id)
  const alterarStatusUsuario = (row) => {
    const novo = row.statusBanco === "ativo" ? "inativo" : "ativo";
    executar(
      row.id,
      () =>
        requisicaoApi(`/usuarios/${row.id}`, {
          method: "PATCH",
          body: { status_usu: novo },
          autenticado: "admin",
        }),
      `${row.name} agora está ${novo}.`,
    );
  };

  // Usuários: senha nova para quem esqueceu (PATCH /usuarios/:id/redefinir-senha)
  const redefinirSenha = (row) => {
    const novaSenha = window.prompt(
      `Nova senha para ${row.name} (6 a 20 caracteres). Informe essa senha ao cliente.`,
    );
    if (!novaSenha) return;
    executar(
      `s${row.id}`,
      () =>
        requisicaoApi(`/usuarios/${row.id}/redefinir-senha`, {
          method: "PATCH",
          body: { novaSenha },
          autenticado: "admin",
        }),
      `Senha de ${row.name} redefinida.`,
    );
  };

  // Torneios: abre ou encerra as inscrições (PATCH /torneios/:id)
  const alterarStatusTorneio = (row) => {
    const novo = row.statusBanco === "aberto" ? "encerrado" : "aberto";
    executar(
      row.id,
      () =>
        requisicaoApi(`/torneios/${row.id}`, {
          method: "PATCH",
          body: { status_torn: novo },
          autenticado: "admin",
        }),
      novo === "aberto"
        ? `Inscrições abertas em ${row.name}.`
        : `Inscrições encerradas em ${row.name}.`,
    );
  };

  // Torneios: lista as equipes e participantes (GET /torneios/:id/participantes)
  const carregarInscritos = async (idTorneio) => {
    const resultado = await requisicaoApi(`/torneios/${idTorneio}/participantes`, {
      autenticado: "admin",
    });
    setEquipes(resultado.dados.equipes);
  };

  // Torneios: cadastra uma equipe no torneio (POST /torneios/:id/equipes)
  const adicionarEquipe = (row) => {
    const nome = window.prompt(`Nome da nova equipe do ${row.name} (${row.integrantes} integrantes):`);
    if (!nome || !nome.trim()) return;
    executar(
      `e${row.id}`,
      async () => {
        await requisicaoApi(`/torneios/${row.id}/equipes`, {
          method: "POST",
          body: { nome_equipe: nome.trim() },
          autenticado: "admin",
        });
        await carregarInscritos(row.id);
        setInscritosDe(row.id);
      },
      `Equipe ${nome.trim()} cadastrada.`,
    );
  };

  const verInscritos = async (row) => {
    if (inscritosDe === row.id) {
      setInscritosDe(null);
      return;
    }
    setErroBanco("");
    try {
      await carregarInscritos(row.id);
      setInscritosDe(row.id);
    } catch (error) {
      setErroBanco(mensagemErro(error));
    }
  };

  // Quadras: deixa a quadra disponível ou indisponível (PATCH /quadras/:id)
  const alterarDisponibilidade = (row) => {
    const ficaDisponivel = !row.disponivel;
    executar(
      row.id,
      () =>
        requisicaoApi(`/quadras/${row.id}`, {
          method: "PATCH",
          body: { status_qd: ficaDisponivel ? "disponivel" : "indisponivel" },
          autenticado: "admin",
        }),
      `${row.name} agora está ${ficaDisponivel ? "disponível" : "indisponível"}.`,
    );
  };

  // Minha conta: troca a senha do administrador (PATCH /usuarios/atualiza-senha/:id)
  const trocarSenha = (event) => {
    event.preventDefault();
    executar(
      "senha",
      () =>
        requisicaoApi(`/usuarios/atualiza-senha/${admin.id_usu}`, {
          method: "PATCH",
          body: senhas,
        }),
      "Senha alterada com sucesso.",
    );
    setSenhas({ senhaAtual: "", novaSenha: "" });
  };

  const cards = relatorio
    ? [
        {
          value: String(relatorio.reservasMes),
          label: "Reservas no mês",
          detail: `${reais(relatorio.receitaMes)} recebidos em reservas pagas`,
        },
        {
          value: String(relatorio.clientesAtivos),
          label: "Clientes ativos",
          detail:
            Number(relatorio.clientesNovosMes) === 1
              ? "1 novo cliente neste mês"
              : `${relatorio.clientesNovosMes} novos clientes neste mês`,
        },
        {
          value: `${relatorio.quadrasDisponiveis} de ${relatorio.quadrasTotal}`,
          label: "Quadras disponíveis",
          detail: relatorio.horarioMaisReservado
            ? `Horário mais reservado: ${relatorio.horarioMaisReservado}`
            : "Ainda não há reservas",
        },
      ]
    : [];

  return (
    <div className={styles.mainContent}>
      <main className={styles.modulePage}>
        <div className={styles.moduleTopline}>
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
            {!relatorio && !erroBanco && (
              <article className={styles.reportCard}>
                <span>Carregando indicadores...</span>
              </article>
            )}
            {cards.map((report) => (
              <article className={styles.reportCard} key={report.label}>
                <span>{report.label}</span>
                <strong>{report.value}</strong>
                <small>{report.detail}</small>
              </article>
            ))}
            {relatorio && (
              <article
                className={`${styles.modulePanel} ${styles.reportHighlight}`}
              >
                <div>
                  <span className={styles.panelEyebrow}>TORNEIOS</span>
                  <h2>
                    {relatorio.torneiosAbertos}{" "}
                    {relatorio.torneiosAbertos === 1
                      ? "torneio com inscrições abertas"
                      : "torneios com inscrições abertas"}
                  </h2>
                  <p>
                    {relatorio.inscricoesConfirmadas} inscrições confirmadas e{" "}
                    {relatorio.inscricoesPendentes} aguardando pagamento.
                  </p>
                </div>
                <span className={styles.reportTrend}>
                  {relatorio.inscricoesPendentes}
                </span>
              </article>
            )}
            {erroBanco && (
              <p className={styles.errorMessage} role="alert">
                {erroBanco}
              </p>
            )}
          </section>
        )}

        {modulo === "configuracoes" && (
          <section className={styles.modulePanel}>
            <div className={styles.settingsList}>
              <div className={styles.settingRow}>
                <span>
                  <strong>{admin?.nome_usu || "Administrador"}</strong>
                  <small>{admin?.email_usu || "—"}</small>
                </span>
              </div>
            </div>

            {admin && Number.isInteger(Number(admin.id_usu)) ? (
              <form className={styles.moduleForm} onSubmit={trocarSenha}>
                <input
                  type="password"
                  value={senhas.senhaAtual}
                  onChange={(event) =>
                    setSenhas((atual) => ({ ...atual, senhaAtual: event.target.value }))
                  }
                  placeholder="Senha atual"
                  aria-label="Senha atual"
                  required
                />
                <input
                  type="password"
                  value={senhas.novaSenha}
                  onChange={(event) =>
                    setSenhas((atual) => ({ ...atual, novaSenha: event.target.value }))
                  }
                  placeholder="Nova senha (6 a 20 caracteres)"
                  aria-label="Nova senha"
                  required
                />
                <button
                  type="submit"
                  className={styles.moduleButton}
                  disabled={salvandoId === "senha"}
                >
                  {salvandoId === "senha" ? "Salvando..." : "Trocar senha"}
                </button>
              </form>
            ) : (
              <p className={styles.recordsEmpty}>
                Esta é a conta de acesso de emergência, definida no arquivo
                .env do servidor. A senha dela é alterada nesse arquivo.
              </p>
            )}
            {erroBanco && (
              <p className={styles.errorMessage} role="alert">
                {erroBanco}
              </p>
            )}
            {notice && <p className={styles.successMessage}>{notice}</p>}
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
              <form
                className={styles.moduleForm}
                style={{ flexWrap: "wrap" }}
                onSubmit={handleAdd}
              >
                {(CAMPOS[modulo] || []).map((campo) =>
                  campo.options ? (
                    <select
                      key={campo.name}
                      value={formDados[campo.name] ?? ""}
                      onChange={(event) =>
                        setFormDados((atual) => ({
                          ...atual,
                          [campo.name]: event.target.value,
                        }))
                      }
                      aria-label={campo.placeholder}
                      required={campo.required}
                      style={{ minWidth: "200px" }}
                    >
                      <option value="">{campo.placeholder}</option>
                      {campo.options.map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </select>
                  ) : (
                  <input
                    key={campo.name}
                    maxLength={campo.maxLength}
                    required={campo.required}
                    type={campo.type || "text"}
                    step={campo.type === "number" ? "any" : undefined}
                    min={campo.type === "number" ? "0" : undefined}
                    value={formDados[campo.name] ?? ""}
                    onChange={(event) =>
                      setFormDados((atual) => ({
                        ...atual,
                        [campo.name]: event.target.value,
                      }))
                    }
                    placeholder={campo.placeholder}
                    aria-label={campo.placeholder}
                    style={{ minWidth: "200px" }}
                  />
                  ),
                )}
                <button
                  type="submit"
                  className={styles.moduleButton}
                  disabled={salvandoId === "novo"}
                >
                  {salvandoId === "novo" ? "Salvando..." : "Salvar"}
                </button>
              </form>
            )}

            <div className={styles.recordsList}>
              {!carregando && !erroBanco && rows.length === 0 && config.vazio && (
                <p className={styles.recordsEmpty}>{config.vazio}</p>
              )}
              {rows.map((row, index) => (
                <div key={`${row.id}-${index}`}>
                  <article className={styles.recordRow}>
                    <div>
                      <strong>{row.name}</strong>
                      <span>{row.detail}</span>
                    </div>
                    <span className={styles.recordRole}>
                      {row.role}
                      {row.roleDetail && (
                        <small className={styles.recordRoleDetail}>
                          {row.roleDetail}
                        </small>
                      )}
                    </span>
                    <span
                      className={`${styles.status} ${getStatusClass(row.status)}`}
                    >
                      {row.status}
                    </span>
                    {fonte === "usuarios" &&
                      ["ativo", "inativo"].includes(row.statusBanco) &&
                      String(row.id) !== String(admin?.id_usu) && (
                        <span style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className={styles.rowButton}
                            onClick={() => alterarStatusUsuario(row)}
                            disabled={salvandoId === row.id}
                          >
                            {salvandoId === row.id
                              ? "Salvando..."
                              : row.statusBanco === "ativo"
                                ? "Inativar"
                                : "Reativar"}
                          </button>
                          <button
                            type="button"
                            className={styles.rowButton}
                            onClick={() => redefinirSenha(row)}
                            disabled={salvandoId === `s${row.id}`}
                          >
                            Redefinir senha
                          </button>
                        </span>
                      )}
                    {fonte === "torneios" && (
                      <span style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className={styles.rowButton}
                          onClick={() => verInscritos(row)}
                        >
                          {inscritosDe === row.id ? "Fechar equipes" : "Ver equipes"}
                        </button>
                        <button
                          type="button"
                          className={styles.rowButton}
                          onClick={() => adicionarEquipe(row)}
                          disabled={salvandoId === `e${row.id}`}
                        >
                          Adicionar equipe
                        </button>
                        <button
                          type="button"
                          className={styles.rowButton}
                          onClick={() => alterarStatusTorneio(row)}
                          disabled={salvandoId === row.id}
                        >
                          {salvandoId === row.id
                            ? "Salvando..."
                            : row.statusBanco === "aberto"
                              ? "Encerrar inscrições"
                              : "Abrir inscrições"}
                        </button>
                      </span>
                    )}
                    {fonte === "quadras" && (
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

                  {fonte === "torneios" && inscritosDe === row.id && (
                    <div className={styles.recordsList} style={{ paddingLeft: "18px" }}>
                      {equipes.length === 0 && (
                        <p className={styles.recordsEmpty}>
                          Nenhuma equipe cadastrada neste torneio. Use
                          "Adicionar equipe".
                        </p>
                      )}
                      {equipes.map((equipe) => [
                        <p
                          key={`eq${equipe.id}`}
                          className={styles.recordsEmpty}
                          style={{ margin: "6px 0 0", textAlign: "left" }}
                        >
                          <strong>Equipe {equipe.nome}</strong> —{" "}
                          {equipe.participantes.filter((p) => p.status !== "cancelado").length} de{" "}
                          {row.integrantes} integrantes
                        </p>,
                        ...equipe.participantes.map((participante) => (
                          <article
                            className={styles.recordRow}
                            key={participante.idParticipacao}
                          >
                            <div>
                              <strong>{participante.nome}</strong>
                              <span>
                                {[participante.email, participante.telefone]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            </div>
                            <span className={styles.recordRole}>
                              Equipe {equipe.nome}
                              {(participante.nivel || participante.categoria) && (
                                <small className={styles.recordRoleDetail}>
                                  {[
                                    participante.nivel,
                                    participante.categoria && `Categoria ${participante.categoria}`,
                                  ]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </small>
                              )}
                            </span>
                            <span
                              className={`${styles.status} ${getStatusClass(participante.status)}`}
                            >
                              {participante.status === "confirmado"
                                ? "Pago e confirmado"
                                : participante.status === "cancelado"
                                  ? "Cancelado"
                                  : "Aguardando pagamento"}
                            </span>
                          </article>
                        )),
                      ])}
                    </div>
                  )}
                </div>
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
