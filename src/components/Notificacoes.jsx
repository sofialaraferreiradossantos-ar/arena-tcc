import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCalendarCheck,
  FaCalendarTimes,
  FaTrophy,
  FaUserPlus,
  FaUserShield,
} from "react-icons/fa";
import styles from "../styles/notificacoes.module.css";
import { requisicaoApi } from "../services/api.js";

const ICONES = {
  pedido_admin: FaUserShield,
  novo_cliente: FaUserPlus,
  inscricao_torneio: FaTrophy,
  nova_reserva: FaCalendarCheck,
  reserva_cancelada: FaCalendarTimes,
  torneio_proximo: FaTrophy,
};

// Busca novas notificações a cada minuto
const INTERVALO_ATUALIZACAO = 60000;

function tempoRelativo(segundos) {
  if (segundos < 60) return "agora";
  if (segundos < 3600) return `há ${Math.floor(segundos / 60)} min`;
  if (segundos < 86400) return `há ${Math.floor(segundos / 3600)} h`;
  if (segundos < 172800) return "ontem";
  return `há ${Math.floor(segundos / 86400)} dias`;
}

// Sino de notificações da barra do topo.
// admin = true usa o token do administrador; senão, o do cliente.
export default function Notificacoes({ admin, classeBotao }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const autenticado = admin ? "admin" : true;

  const [aberto, setAberto] = useState(false);
  const [lista, setLista] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [sessaoValida, setSessaoValida] = useState(true);
  const areaRef = useRef(null);

  const carregar = useCallback(() => {
    return requisicaoApi("/notificacoes", { autenticado })
      .then((resultado) => {
        setLista(resultado.dados);
        setNaoLidas(resultado.naoLidas);
        setSessaoValida(true);
      })
      .catch((error) => {
        // Sessão expirada (ex.: backend reiniciado): esconde o sino
        if (error.precisaLogin) setSessaoValida(false);
      });
  }, [autenticado]);

  // Atualiza ao trocar de página e de minuto em minuto
  useEffect(() => {
    carregar();
    const timer = setInterval(carregar, INTERVALO_ATUALIZACAO);
    return () => clearInterval(timer);
  }, [carregar, pathname]);

  // Fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!aberto) return;
    const fecharFora = (event) => {
      if (areaRef.current && !areaRef.current.contains(event.target)) {
        setAberto(false);
      }
    };
    const fecharEsc = (event) => event.key === "Escape" && setAberto(false);
    document.addEventListener("mousedown", fecharFora);
    window.addEventListener("keydown", fecharEsc);
    return () => {
      document.removeEventListener("mousedown", fecharFora);
      window.removeEventListener("keydown", fecharEsc);
    };
  }, [aberto]);

  function alternar() {
    if (!aberto) carregar();
    setAberto((atual) => !atual);
  }

  function abrirNotificacao(notificacao) {
    if (!notificacao.lida) {
      setLista((atual) =>
        atual.map((n) => (n.id === notificacao.id ? { ...n, lida: true } : n)),
      );
      setNaoLidas((atual) => Math.max(0, atual - 1));
      requisicaoApi(`/notificacoes/${notificacao.id}/lida`, {
        method: "PATCH",
        autenticado,
      }).catch(() => {});
    }

    setAberto(false);
    if (notificacao.link) navigate(notificacao.link);
  }

  function marcarTodas() {
    setLista((atual) => atual.map((n) => ({ ...n, lida: true })));
    setNaoLidas(0);
    requisicaoApi("/notificacoes/lidas", { method: "PATCH", autenticado })
      .catch(() => {})
      .finally(carregar);
  }

  if (!sessaoValida) return null;

  const rotulo =
    naoLidas > 0
      ? `Notificações: ${naoLidas} não ${naoLidas === 1 ? "lida" : "lidas"}`
      : "Notificações";

  return (
    <div className={styles.area} ref={areaRef}>
      <button
        type="button"
        className={`${classeBotao} ${styles.sino}`}
        onClick={alternar}
        aria-label={rotulo}
        aria-expanded={aberto}
        title={rotulo}
      >
        <FaBell />
        {naoLidas > 0 && (
          <span className={styles.contador} aria-hidden="true">
            {naoLidas > 9 ? "9+" : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className={styles.painel} role="dialog" aria-label="Notificações">
          <div className={styles.topo}>
            <strong>Notificações</strong>
            {naoLidas > 0 && (
              <button
                type="button"
                className={styles.marcarTodas}
                onClick={marcarTodas}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {lista.length === 0 ? (
            <p className={styles.vazio}>
              {admin
                ? "Nenhuma novidade por aqui. Pedidos de acesso, cadastros, inscrições e reservas aparecem aqui."
                : "Nenhuma notificação. Avisamos aqui quando o seu torneio estiver chegando."}
            </p>
          ) : (
            <ul className={styles.lista}>
              {lista.map((notificacao) => {
                const Icone = ICONES[notificacao.tipo] || FaBell;
                return (
                  <li key={notificacao.id}>
                    <button
                      type="button"
                      className={`${styles.item} ${
                        notificacao.lida ? "" : styles.naoLida
                      }`}
                      onClick={() => abrirNotificacao(notificacao)}
                    >
                      <span className={styles.icone}>
                        <Icone />
                      </span>
                      <span className={styles.texto}>
                        <strong>{notificacao.titulo}</strong>
                        <span>{notificacao.mensagem}</span>
                        <small>{tempoRelativo(notificacao.haSegundos)}</small>
                      </span>
                      {!notificacao.lida && (
                        <span className={styles.ponto} aria-label="Não lida" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
