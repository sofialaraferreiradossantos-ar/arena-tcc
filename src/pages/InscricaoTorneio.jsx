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
  buscarEquipes,
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
  // Equipes cadastradas pelo administrador
  const [equipes, setEquipes] = useState([]);

  useEffect(() => {
    Promise.all([buscarTorneio(id), buscarEquipes(id)])
      .then(([encontrado, lista]) => {
        if (!encontrado) setErro("Torneio não encontrado.");
        setTorneio(encontrado);
        setEquipes(lista);
      })
      .catch((error) => setErro(error.message))
      .finally(() => setCarregando(false));
  }, [id]);

  // Nível e categoria já vêm de "Minha categoria", se houver
  const [form, setForm] = useState(() => {
    const minhaCategoria = carregarMinhaCategoria();
    return {
      id_equipe: "",
      telefone: "",
      nivel: minhaCategoria?.nivel ?? "",
      categoria: minhaCategoria?.categoria ?? "",
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Grava o cliente como participante da equipe escolhida
  // (POST /torneios/:id/inscricao) e segue para o pagamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!form.id_equipe || !form.telefone.trim() || !form.nivel || !form.categoria) {
      setErro("Escolha a equipe e preencha o telefone, o nível e a categoria.");
      return;
    }

    const digitos = form.telefone.replace(/\D/g, "");
    if (digitos.length < 10 || digitos.length > 11) {
      setErro("Informe o telefone com DDD, por exemplo (14) 99999-0000.");
      return;
    }

    setEnviando(true);
    try {
      const resultado = await inscreverNoTorneio(id, form);
      const inscricao = resultado.dados;
      navigate("/pagamento", {
        state: {
          inscricao: {
            id_part: inscricao.id_part,
            status: inscricao.status_part,
            torneio: torneio.nome,
            equipe: inscricao.nome_equipe,
            data: torneio.data,
            valor: torneio.valor,
          },
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

  const temVaga = torneio.aceitaInscricao && equipes.some((equipe) => equipe.vagas > 0);

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
            <p>Escolha a sua equipe e preencha seus dados para garantir a vaga.</p>
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
            <h2>Dados do participante</h2>
            <p>
              {usuario
                ? `Inscrição em nome de ${usuario.nome_usu} (${usuario.email_usu}).`
                : "Entre na sua conta para se inscrever."}
            </p>

            {precisaLogin ? (
              <Link to="/login" className={styles.confirmarButton}>
                Entrar na minha conta
              </Link>
            ) : !temVaga ? (
              <p role="alert">
                {torneio.status !== "aberto"
                  ? "As inscrições deste torneio não estão abertas."
                  : equipes.length === 0
                    ? "A organização ainda não cadastrou as equipes deste torneio."
                    : "Não há mais vagas neste torneio."}
              </p>
            ) : (
              <>
                <div className={styles.formGrid}>
                  <div
                    className={styles.inputGroup}
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label htmlFor="id_equipe">Equipe</label>
                    <select
                      id="id_equipe"
                      name="id_equipe"
                      value={form.id_equipe}
                      onChange={handleChange}
                    >
                      <option value="">Selecione a sua equipe</option>
                      {equipes.map((equipe) => (
                        <option
                          key={equipe.id_equipe}
                          value={equipe.id_equipe}
                          disabled={equipe.vagas === 0}
                        >
                          {`${equipe.nome_equipe} (${equipe.integrantes} de ${equipe.limite} integrantes${equipe.vagas === 0 ? ", completa" : ""})`}
                        </option>
                      ))}
                    </select>
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
                    <label htmlFor="categoria">Categoria do jogador</label>
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
                  {enviando ? "Enviando..." : "Inscrever-se e ir para o pagamento"}
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
