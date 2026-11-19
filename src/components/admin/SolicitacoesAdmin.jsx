import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes, FaUserShield } from "react-icons/fa";
import styles from "../../styles/administrador.module.css";
import { requisicaoApi } from "../../services/api.js";

function formatarData(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Pedidos de novos administradores. Um admin já aprovado decide quem entra.
export default function SolicitacoesAdmin() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [precisaLogin, setPrecisaLogin] = useState(false);
  const [aviso, setAviso] = useState("");
  const [respondendo, setRespondendo] = useState(null);

  const carregar = useCallback(() => {
    return requisicaoApi("/auth/admin/solicitacoes", { autenticado: "admin" })
      .then((resultado) => {
        setSolicitacoes(resultado.dados);
      })
      .catch((error) => {
        // Se a lista não puder ser carregada, a seção fica simplesmente
        // "sem solicitações" (o motivo vai só para o console)
        console.warn("Solicitações de acesso:", error.message);
        setSolicitacoes([]);
      })
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function responder(solicitacao, acao) {
    if (
      acao === "recusar" &&
      !window.confirm(`Recusar o acesso de ${solicitacao.nome_usu}?`)
    ) {
      return;
    }

    setRespondendo(solicitacao.id_usu);
    setAviso("");

    try {
      const resultado = await requisicaoApi(
        `/auth/admin/solicitacoes/${solicitacao.id_usu}/${acao}`,
        { method: "PATCH", autenticado: "admin" },
      );
      setAviso(`${solicitacao.nome_usu}: ${resultado.mensagem}`);
    } catch (error) {
      setErro(error.message);
      if (error.precisaLogin) setPrecisaLogin(true);
    }

    setRespondendo(null);
    carregar();
  }

  return (
    <section className={styles.solicitacoes} aria-labelledby="titulo-solicitacoes">
      <div className={styles.solicitacoesTopo}>
        <div className={styles.cardIcon}>
          <FaUserShield />
        </div>
        <div>
          <h2 id="titulo-solicitacoes">
            Solicitações de acesso
            {solicitacoes.length > 0 && (
              <span className={styles.solicitacoesContador}>
                {solicitacoes.length}
              </span>
            )}
          </h2>
          <p>Novos administradores só entram depois da sua aprovação.</p>
        </div>
      </div>

      {aviso && (
        <p className={styles.solicitacoesAviso} role="status">
          {aviso}
        </p>
      )}

      {erro && (
        <p className={styles.solicitacoesErro} role="alert">
          {erro}{" "}
          {precisaLogin && <Link to="/admin/login">Entrar novamente</Link>}
        </p>
      )}

      {carregando ? (
        <p className={styles.solicitacoesVazio}>Carregando solicitações...</p>
      ) : solicitacoes.length === 0 ? (
        <p className={styles.solicitacoesVazio}>
          Nenhuma solicitação pendente.
        </p>
      ) : (
        <ul className={styles.solicitacoesLista}>
          {solicitacoes.map((solicitacao) => (
            <li key={solicitacao.id_usu} className={styles.solicitacao}>
              <div className={styles.solicitacaoInfo}>
                <strong>{solicitacao.nome_usu}</strong>
                <span>{solicitacao.email_usu}</span>
                <small>Pedido em {formatarData(solicitacao.dt_cad)}</small>
              </div>

              <div className={styles.solicitacaoAcoes}>
                <button
                  type="button"
                  className={styles.botaoAprovar}
                  onClick={() => responder(solicitacao, "aprovar")}
                  disabled={respondendo === solicitacao.id_usu}
                >
                  <FaCheck /> Aprovar
                </button>
                <button
                  type="button"
                  className={styles.botaoRecusar}
                  onClick={() => responder(solicitacao, "recusar")}
                  disabled={respondendo === solicitacao.id_usu}
                >
                  <FaTimes /> Recusar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
