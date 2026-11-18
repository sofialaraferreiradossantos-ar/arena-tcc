// Chamadas ao backend. Em desenvolvimento o Vite repassa /api para
// http://localhost:3333 (ver vite.config.js).
export const apiUrl = (path) =>
  `${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}${path}`;

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }

  // Sessão expirada (backend reiniciado) ou conta errada (ex.: admin)
  get precisaLogin() {
    return this.status === 401 || this.status === 403;
  }
}

// Faz a requisição e devolve o JSON de sucesso, ou lança ErroApi com a
// mensagem do backend. "autenticado" envia o token do cliente logado.
export async function requisicaoApi(
  path,
  { method = "GET", body, autenticado = false } = {},
) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (autenticado) {
    headers.Authorization = `Bearer ${localStorage.getItem("token_sessao") || ""}`;
  }

  let resposta;

  try {
    resposta = await fetch(apiUrl(path), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ErroApi(
      "Não foi possível falar com o servidor. Verifique se o backend está iniciado.",
      0,
    );
  }

  const resultado = await resposta.json().catch(() => null);

  if (!resposta.ok || !resultado?.sucesso) {
    throw new ErroApi(
      resultado?.mensagem || "Erro na requisição.",
      resposta.status,
    );
  }

  return resultado;
}
