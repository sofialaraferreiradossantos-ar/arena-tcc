import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/agendarHorario.module.css";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Simula horários já ocupados vindos do backend (por enquanto fixo)
const HORARIOS_OCUPADOS = ["10:00", "15:00"];

const PERIODOS = [
  { label: "Manhã", horarios: ["08:00", "09:00", "10:00", "11:00"] },
  { label: "Tarde", horarios: ["13:00", "14:00", "15:00", "16:00", "17:00"] },
  { label: "Noite", horarios: ["18:00", "19:00", "20:00"] },
];

function AgendarHorario() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [quadra, setQuadra] = useState("");
  const [horario, setHorario] = useState("");

  const hoje = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [mesAtual, setMesAtual] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [dataSelecionada, setDataSelecionada] = useState(null);

  const diasDoMes = useMemo(() => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();

    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    const dias = [];

    // espaços vazios antes do dia 1
    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push(null);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      dias.push(new Date(ano, mes, dia));
    }

    return dias;
  }, [mesAtual]);

  const mudarMes = (delta) => {
    setMesAtual((atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1));
    setDataSelecionada(null);
    setHorario("");
  };

  const podeVoltarMes =
    mesAtual.getFullYear() > hoje.getFullYear() ||
    (mesAtual.getFullYear() === hoje.getFullYear() && mesAtual.getMonth() > hoje.getMonth());

  const selecionarDia = (dia) => {
    if (!dia || dia < hoje) return;
    setDataSelecionada(dia);
    setHorario("");
  };

  const formatarDataResumo = (dia) => {
    if (!dia) return "";
    return dia.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  };

  const podeConfirmar = quadra && dataSelecionada && horario;

  const irParaPagamento = () => {
    if (!podeConfirmar) return;
    navigate("/pagamento", {
      state: {
        agendamento: {
          quadra,
          data: dataSelecionada?.toISOString(),
          horario,
        },
      },
    });
  };

  return (
    <div className={styles.mainContent}>

      {/* HEADER */}
      <header className={styles.topHeader}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuAberto(true)}
        >
          ☰
        </button>

        <div className={styles.logoArea}>
          <h2>ARENA <span>BEACH</span></h2>
        </div>

        <div className={styles.userIcon}>👤</div>
      </header>

      {menuAberto && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${menuAberto ? styles.open : ""}`}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => setMenuAberto(false)}
        >
          ✕
        </button>

        <div className={styles.sidebarBrand}>
          <strong>ARENA BEACH</strong>
        </div>

        <nav className={styles.sidebarNav}>
          <Link to="/home" onClick={() => setMenuAberto(false)}>Início</Link>
          <Link to="/quadra" onClick={() => setMenuAberto(false)}>Quadras</Link>
          <Link to="/agendar-horario" onClick={() => setMenuAberto(false)}>Agendar Horário</Link>
          <Link to="/agendamentos" onClick={() => setMenuAberto(false)}>Meus Agendamentos</Link>
          <Link to="/torneios" onClick={() => setMenuAberto(false)}>Torneios</Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <Link to="/login" onClick={() => setMenuAberto(false)}>Sair</Link>
        </div>
      </aside>

      {/* TÍTULO */}
      <div className={styles.pageTitle}>
        <h1>Agendar <span>Horário</span></h1>
        <p>Escolha a quadra, a data e o horário desejado.</p>
      </div>

      <div className={styles.formLayout}>

        {/* ETAPA 1 - QUADRA */}
        <section className={`${styles.formCard} ${styles.cardFull}`}>
          <span className={styles.stepTag}>Etapa 1</span>
          <label htmlFor="quadra" className={styles.label}>Quadra</label>
          <select
            id="quadra"
            className={styles.select}
            value={quadra}
            onChange={(e) => setQuadra(e.target.value)}
          >
            <option value="">Selecione uma quadra</option>
            <option value="Beach Tennis">Beach Tennis</option>
            <option value="Futevôlei">Futevôlei</option>
            <option value="Futebol">Futebol</option>
                <option value="Vôlei">Vôlei</option>
              </select>
            </section>

            {/* ETAPA 2 - DATA */}
            <section className={styles.formCard}>
          <span className={styles.stepTag}>Etapa 2</span>
          <span className={styles.label}>Data</span>

          {/* CALENDÁRIO */}
          <div className={styles.calendar}>

            <div className={styles.calendarHeader}>
              <button
                type="button"
                className={styles.calendarNav}
                onClick={() => mudarMes(-1)}
                disabled={!podeVoltarMes}
              >
                ‹
              </button>

              <span className={styles.calendarMonth}>
                {MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
              </span>

              <button
                type="button"
                className={styles.calendarNav}
                onClick={() => mudarMes(1)}
              >
                ›
              </button>
            </div>

            <div className={styles.calendarWeekdays}>
              {DIAS_SEMANA.map((d, i) => (
                <span key={`${d}-${i}`}>{d}</span>
              ))}
            </div>

            <div className={styles.calendarGrid}>
              {diasDoMes.map((dia, index) => {
                if (!dia) {
                  return <span key={`vazio-${index}`} className={styles.calendarEmpty} />;
                }

                const passado = dia < hoje;
                const selecionado =
                  dataSelecionada &&
                  dia.toDateString() === dataSelecionada.toDateString();
                const ehHoje = dia.toDateString() === hoje.toDateString();

                return (
                  <button
                    key={dia.toISOString()}
                    type="button"
                    disabled={passado}
                    className={[
                      styles.calendarDay,
                      selecionado ? styles.calendarDaySelected : "",
                      ehHoje && !selecionado ? styles.calendarDayToday : "",
                    ].join(" ")}
                    onClick={() => selecionarDia(dia)}
                  >
                    {dia.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ETAPA 3 - HORÁRIO */}
        <section className={styles.formCard}>
          <span className={styles.stepTag}>Etapa 3</span>
          <span className={styles.label}>Horário</span>

          <div className={styles.horariosBlock}>
            {!dataSelecionada ? (
              <p className={styles.hintText}>Selecione uma data para ver os horários disponíveis.</p>
            ) : (
              PERIODOS.map((periodo) => (
                <div key={periodo.label} className={styles.periodo}>
                  <span className={styles.periodoLabel}>{periodo.label}</span>

                  <div className={styles.horarios}>
                    {periodo.horarios.map((item) => {
                      const ocupado = HORARIOS_OCUPADOS.includes(item);
                      const selecionado = horario === item;

                      return (
                        <button
                          key={item}
                          type="button"
                          disabled={ocupado}
                          className={[
                            styles.horarioBtn,
                            selecionado ? styles.horarioSelecionado : "",
                            ocupado ? styles.horarioOcupado : "",
                          ].join(" ")}
                          onClick={() => setHorario(item)}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

        </section>

      </div>

      {/* BARRA DE AÇÃO FIXA */}
      <div className={styles.actionBar}>
        <p className={styles.actionHint}>
          {podeConfirmar
            ? `${quadra} • ${formatarDataResumo(dataSelecionada)} • ${horario}`
            : "Preencha quadra, data e horário para continuar."}
        </p>

        <button
          type="button"
          className={styles.agendar}
          disabled={!podeConfirmar}
          onClick={irParaPagamento}
        >
          Agendar
        </button>
      </div>

    </div>
  );
}

export default AgendarHorario;
