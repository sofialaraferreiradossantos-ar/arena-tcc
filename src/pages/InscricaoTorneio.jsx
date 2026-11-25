import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import styles from "../styles/inscricao.module.css";
import {
  CATEGORIAS_CLIENTE,
  NIVEIS,
  carregarMinhaCategoria,
} from "../mockup/torneios.js";
import {
  buscarTorneio,
  formatarValor,
  inscreverNoTorneio,
} from "../services/torneios.js";

// Cliente logado (salvo no login): nome e e-mail vêm da conta
function usuarioLogado() {
  if (!localStorage.getItem("token_sessao")) return null;
  try {
    return JSON.parse(localStorage.getItem("usuario")) || null;
  } catch {
    return null;
  }
}

function InscricaoTorneio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const usuario = usuarioLogado();

  // Torneio do banco de dados (GET /torneios)
  const [torneio, setTorneio] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [precisaLogin, setPrecisaLogin] = useState(!usuario);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    buscarTorneio(id)
      .then((encontrado) => {
        if (!encontrado) setErro("Torneio não encontrado.");
        setTorneio(encontrado);
      })
      .catch((error) => setErro(error.message))
      .finally(() => setCarregando(false));
  }, [id]);

  // Campos da equipe; nível e categoria já vêm de "Minha categoria", se houver
  const [form, setForm] = useState(() => {
    const minhaCategoria = carregarMinhaCategoria();
    return {
      nome_equipe: "",
      desc_equipe: "",
      telefone: "",
      nivel: minhaCategoria?.nivel ?? "",
      categoria: minhaCategoria?.categoria ?? "",
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Grava a equipe e o cliente como participante (POST /torneios/:id/inscricao)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!form.nome_equipe.trim() || !form.telefone.trim() || !form.nivel || !form.categoria) {
      setErro("Preencha o nome da equipe, o telefone, o nível e a categoria.");
      return;
    }

    const digitos = form.telefone.replace(/\D/g, "");
    if (digitos.length < 10 || digitos.length > 11) {
      setErro("Informe o telefone com DDD, por exemplo (14) 99999-0000.");
      return;
    }

    setEnviando(true);
    try {
      await inscreverNoTorneio(id, form);
      // Mostra o valor da inscrição (pago na arena)
      navigate("/pagamento", {
        state: {
          inscricao: { torneioId: id, torneio: torneio.nome, valor: torneio.valor },
        },
      });
    } catch (error) {
      if (error.precisaLogin) setPrecisaLogin(true);
      setErro(error.message);
      setEnviando(false);
    }
  };

  if (carregando || !torneio) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div>
              <h1>
                Inscrição no <span>Torneio</span>
              </h1>
              <p>{carregando ? "Carregando torneio..." : erro}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      <aside
        className={`${styles.sidebarMenu} ${menuAberto ? styles.open : ""}`}
      >
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
          🎾 Quadras
        </Link>
        <Link to="/agendar-horario" onClick={() => setMenuAberto(false)}>
          🕐 Agendar Horário
        </Link>
        <Link to="/agendamentos" onClick={() => setMenuAberto(false)}>
          📅 Agendamentos
        </Link>
        <Link
          to="/torneios"
          className={styles.active}
          onClick={() => setMenuAberto(false)}
        >
          🏆 Torneios
        </Link>
        <Link to="/pagamento" onClick={() => setMenuAberto(false)}>
          💳 Pagamento
        </Link>

        <Link
          to="/login"
          className={styles.sair}
          onClick={() => setMenuAberto(false)}
        >
          🚪 Sair
        </Link>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div>
            <h1>
              Inscrição no <span>Torneio</span>
            </h1>
            <p>Crie a sua equipe e preencha seus dados para garantir a vaga.</p>
          </div>
        </div>

        <div className={styles.inscricaoCard}>
          {/* INFORMAÇÕES DO TORNEIO */}
          <div className={styles.torneioInfo}>
            <div className={styles.infoHeader}>
              <div className={styles.trophyIcon}>
                <FaTrophy />
              </div>
              <div>
                <small>TORNEIO</small>
                <h2>{torneio.nome}</h2>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <small>Local</small>
                  <strong>{torneio.local}</strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span>
                  <FaRegCalendarAlt />
                </span>
                <div>
                  <small>Data</small>
                  <strong>{torneio.data}</strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span>
                  <FaUsers />
                </span>
                <div>
                  <small>Vagas</small>
                  <strong>{torneio.vagasTexto}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form className={styles.formSection} onSubmit={handleSubmit}>
            <h2>Dados da equipe</h2>
            <p>
              {usuario
                ? `Inscrição em nome de ${usuario.nome_usu} (${usuario.email_usu}).`
                : "Entre na sua conta para se inscrever."}
            </p>

            {precisaLogin ? (
              <Link to="/login" className={styles.confirmarButton}>
                Entrar na minha conta
              </Link>
            ) : !torneio.aceitaInscricao ? (
              <p role="alert">
                {torneio.status === "aberto"
                  ? "Não há mais vagas neste torneio."
                  : "As inscrições deste torneio não estão abertas."}
              </p>
            ) : (
              <>
                <div className={styles.formGrid}>
                  <div
                    className={styles.inputGroup}
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label htmlFor="nome_equipe">Nome da equipe</label>
                    <input
                      id="nome_equipe"
                      name="nome_equipe"
                      type="text"
                      maxLength={100}
                      value={form.nome_equipe}
                      onChange={handleChange}
                      placeholder="Ex.: Areia Quente"
                    />
                  </div>

                  <div
                    className={styles.inputGroup}
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label htmlFor="telefone">Telefone</label>
                    <input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      maxLength={20}
                      value={form.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="nivel">Nível</label>
                    <select
                      id="nivel"
                      name="nivel"
                      value={form.nivel}
                      onChange={handleChange}
                    >
                      <option value="">Selecione seu nível</option>
                      {NIVEIS.map((nivel) => (
                        <option key={nivel} value={nivel}>
                          {nivel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="categoria">Categoria</label>
                    <select
                      id="categoria"
                      name="categoria"
                      value={form.categoria}
                      onChange={handleChange}
                    >
                      <option value="">Selecione sua categoria</option>
                      {CATEGORIAS_CLIENTE.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          Categoria {categoria}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    className={styles.inputGroup}
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label htmlFor="desc_equipe">Descrição da equipe (opcional)</label>
                    <input
                      id="desc_equipe"
                      name="desc_equipe"
                      type="text"
                      maxLength={300}
                      value={form.desc_equipe}
                      onChange={handleChange}
                      placeholder="Ex.: dupla formada por atletas de Tupã"
                    />
                  </div>
                </div>

                {/* RESUMO DE VALORES */}
                <div className={styles.resumo}>
                  <div>
                    <span>Valor da inscrição</span>
                    <strong>{formatarValor(torneio.valor)}</strong>
                  </div>
                  <div>
                    <span>Taxa de serviço</span>
                    <strong>R$ 0,00</strong>
                  </div>
                  <div className={styles.total}>
                    <span>Total</span>
                    <strong>{formatarValor(torneio.valor)}</strong>
                  </div>
                </div>

                {erro && <p role="alert">{erro}</p>}

                <button
                  type="submit"
                  className={styles.confirmarButton}
                  disabled={enviando}
                >
                  {enviando ? "Enviando..." : "Confirmar Inscrição"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default InscricaoTorneio;
