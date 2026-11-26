const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth");
const UsuariosController = require("../controllers/usuarios");
const AgendamentosController = require("../controllers/agendamentos");
const DisponibilidadesController = require("../controllers/disponibilidades");
const EquipesTorneiosController = require("../controllers/equipesTorneios");
const PagamentosController = require("../controllers/pagamentos");
const ParticipantesEquipesController = require("../controllers/participantesEquipes");
const QuadrasController = require("../controllers/quadras");
const TorneiosController = require("../controllers/torneios");
const StripeController = require("../controllers/stripe");
const FaturasController = require("../controllers/faturas");
const NotificacoesController = require("../controllers/notificacoes");
const RelatoriosController = require("../controllers/relatorios");

const { exigirLogin, exigirUsuario, exigirAdmin } = require("../middleware/autenticacao");

const uploadImage = require("../middleware/uploadHelper");

// Middleware configurado para a pasta 'quadras' (backend/public/quadras)
const uploadQuadras = uploadImage("quadras");



// =====================================================
// AUTENTICAÇÃO
// =====================================================

router.post("/auth/login", AuthController.login);
router.post("/auth/admin/login", AuthController.adminLogin);
// Cria a conta de admin como "pendente": só entra depois de aprovada
router.post("/auth/admin/cadastro", AuthController.adminCadastro);
router.get("/auth/admin/solicitacoes", exigirAdmin, AuthController.listarSolicitacoes);
router.patch("/auth/admin/solicitacoes/:id/:acao", exigirAdmin, AuthController.responderSolicitacao);
router.post("/auth/logout", AuthController.logout);
router.get("/auth/me", AuthController.sessaoAtual);


// =====================================================
// NOTIFICAÇÕES (cliente vê as dele; admin vê as dos administradores)
// =====================================================

router.get("/notificacoes", exigirLogin, NotificacoesController.listar);
router.patch("/notificacoes/lidas", exigirLogin, NotificacoesController.marcarTodas);
router.patch("/notificacoes/:id/lida", exigirLogin, NotificacoesController.marcarLida);


// =====================================================
// RELATÓRIOS (painel do administrador)
// =====================================================

router.get("/relatorios", exigirAdmin, RelatoriosController.resumo);


// =====================================================
// AGENDAMENTOS
// =====================================================

// Público: só os horários ocupados (sem dados dos clientes)
router.get("/agendamentos/ocupados", AgendamentosController.listarOcupados);

// Cliente logado: as próprias reservas. Para criar uma reserva o cliente
// passa pelo pagamento (POST /pagamentos/stripe/checkout).
router.get("/agendamentos/meus", exigirUsuario, AgendamentosController.listarMeus);
router.patch("/agendamentos/meus/:id", exigirUsuario, AgendamentosController.remarcarMeu);
router.delete("/agendamentos/meus/:id", exigirUsuario, AgendamentosController.cancelarMeu);

// Administrador: todas as reservas. Criar/editar direto permite marcar
// "confirmado" sem pagar, por isso é restrito.
router.get("/agendamentos", exigirAdmin, AgendamentosController.listarAgendamentos);
router.post("/agendamentos", exigirAdmin, AgendamentosController.cadastrarAgendamentos);
router.patch("/agendamentos/:id", exigirAdmin, AgendamentosController.editarAgendamentos);
router.delete("/agendamentos/:id", exigirAdmin, AgendamentosController.apagarAgendamentos);


// =====================================================
// DISPONIBILIDADES
// =====================================================

router.get(
    "/disponibilidades",
    DisponibilidadesController.listarDisponibilidades
);

// Cadastrar, editar e apagar horários: só administrador
router.post(
    "/disponibilidades",
    exigirAdmin,
    DisponibilidadesController.cadastrarDisponibilidades
);

router.patch(
    "/disponibilidades/:id",
    exigirAdmin,
    DisponibilidadesController.editarDisponibilidades
);

router.delete(
    "/disponibilidades/:id",
    exigirAdmin,
    DisponibilidadesController.apagarDisponibilidades
);


// =====================================================
// EQUIPES DE TORNEIOS
// =====================================================

router.get(
    "/equipesTorneios",
    EquipesTorneiosController.listarEquipesTorneios
);

router.post(
    "/equipesTorneios", exigirAdmin, EquipesTorneiosController.cadastrarEquipesTorneios
);

router.patch(
    "/equipesTorneios/:id", exigirAdmin, EquipesTorneiosController.editarEquipesTorneios
);

router.delete(
    "/equipesTorneios/:id", exigirAdmin, EquipesTorneiosController.apagarEquipesTorneios
);


// =====================================================
// PAGAMENTOS
// =====================================================

// Pagamento online (cliente logado)
router.post("/pagamentos/stripe/checkout", exigirUsuario, StripeController.criarCheckout);
// Pagamento da inscrição em torneio (participação "pendente" do cliente)
router.post("/pagamentos/stripe/checkout-inscricao", exigirUsuario, StripeController.criarCheckoutInscricao);
router.get("/pagamentos/stripe/sessao/:sessionId", exigirUsuario, StripeController.consultarSessao);
router.post("/pagamentos/stripe/sessao/:sessionId/cancelar", exigirUsuario, StripeController.cancelarSessao);

// Gestão de pagamentos (somente administrador)
router.get("/pagamentos", exigirAdmin, PagamentosController.listarPagamentos);
router.post("/pagamentos", exigirAdmin, PagamentosController.cadastrarPagamentos);
router.patch("/pagamentos/:id", exigirAdmin, PagamentosController.editarPagamentos);
router.delete("/pagamentos/:id", exigirAdmin, PagamentosController.apagarPagamentos);

// Faturas mensais dos clientes fixos (somente administrador)
// Também dá para rodar pelo terminal: npm run faturar -- AAAA-MM
router.get("/faturas/pendentes", exigirAdmin, FaturasController.listarPendentes);
router.post("/faturas", exigirAdmin, FaturasController.criarFatura);

// O webhook do Stripe (POST /webhooks/stripe) fica no index.js, porque
// precisa do corpo da requisição sem passar pelo express.json().


// =====================================================
// PARTICIPANTES DE EQUIPES
// =====================================================

router.get(
    "/participantesEquipes", exigirAdmin, ParticipantesEquipesController.listarParticipantesEquipes
);

router.post(
    "/participantesEquipes", exigirAdmin, ParticipantesEquipesController.cadastrarParticipantesEquipes
);

router.patch(
    "/participantesEquipes/:id", exigirAdmin, ParticipantesEquipesController.editarParticipantesEquipes
);

router.delete(
    "/participantesEquipes/:id", exigirAdmin, ParticipantesEquipesController.apagarParticipantesEquipes
);


// =====================================================
// QUADRAS
// =====================================================

router.get("/quadras", QuadrasController.listarQuadras);
router.get("/quadras/tipos", QuadrasController.listarTipos);
router.get("/quadras/destaques", QuadrasController.listarDestaques);
router.post("/quadras", uploadQuadras.single("imagem_qd"), QuadrasController.cadastrarQuadras);
router.patch("/quadras/:id", uploadQuadras.single("imagem_qd"), QuadrasController.editarQuadras);
router.delete("/quadras/:id", QuadrasController.apagarQuadras);


// =====================================================
// TORNEIOS
// =====================================================

router.get("/torneios", TorneiosController.listarTorneios);
// Público: equipes do torneio e vagas de cada uma (sem dados pessoais)
router.get("/torneios/:id/equipes", TorneiosController.listarEquipesDoTorneio);
// Admin: cadastra as equipes (duplas) e vê os inscritos com telefone/e-mail
router.post("/torneios/:id/equipes", exigirAdmin, TorneiosController.cadastrarEquipeDoTorneio);
router.get("/torneios/:id/participantes", exigirAdmin, TorneiosController.listarParticipantesDoTorneio);
// Inscrição pelo site: o cliente logado escolhe uma equipe e entra nela
router.post("/torneios/:id/inscricao", exigirUsuario, TorneiosController.inscreverNoTorneio);
router.post("/torneios", TorneiosController.cadastrarTorneios);
router.patch("/torneios/:id", TorneiosController.editarTorneios);
router.delete("/torneios/:id", TorneiosController.apagarTorneios);


// =====================================================
// USUÁRIOS
// =====================================================

// Cadastro de cliente e troca de senha (exige a senha atual) são públicos.
// Listar/editar/inativar é só do admin: sem isso, um admin "pendente"
// poderia se ativar sozinho com PATCH /usuarios/:id {status_usu: "ativo"}.
router.get("/usuarios", exigirAdmin, UsuariosController.listarUsuarios);
router.post("/usuarios", UsuariosController.cadastrarUsuarios);
router.patch("/usuarios/:id", exigirAdmin, UsuariosController.editarUsuarios);
router.patch("/usuarios/atualiza-senha/:id", UsuariosController.atualizarSenha);
// O administrador define uma senha nova quando o cliente esquece a dele
router.patch("/usuarios/:id/redefinir-senha", exigirAdmin, UsuariosController.redefinirSenha);
router.delete("/usuarios/:id", exigirAdmin, UsuariosController.apagarUsuarios);


module.exports = router;
