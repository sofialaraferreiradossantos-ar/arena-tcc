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

const { exigirUsuario, exigirAdmin } = require("../middleware/autenticacao");

const uploadImage = require("../middleware/uploadHelper");

// Middleware configurado para a pasta 'quadras' (backend/public/quadras)
const uploadQuadras = uploadImage("quadras");



// =====================================================
// AUTENTICAÇÃO
// =====================================================

router.post("/auth/login", AuthController.login);
router.post("/auth/admin/login", AuthController.adminLogin);
router.post("/auth/admin/cadastro", AuthController.adminCadastro);
router.post("/auth/logout", AuthController.logout);
router.get("/auth/me", AuthController.sessaoAtual);


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

router.post(
    "/disponibilidades",
    DisponibilidadesController.cadastrarDisponibilidades
);

router.patch(
    "/disponibilidades/:id",
    DisponibilidadesController.editarDisponibilidades
);

router.delete(
    "/disponibilidades/:id",
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
    "/equipesTorneios",
    EquipesTorneiosController.cadastrarEquipesTorneios
);

router.patch(
    "/equipesTorneios/:id",
    EquipesTorneiosController.editarEquipesTorneios
);

router.delete(
    "/equipesTorneios/:id",
    EquipesTorneiosController.apagarEquipesTorneios
);


// =====================================================
// PAGAMENTOS
// =====================================================

// Pagamento online (cliente logado)
router.post("/pagamentos/stripe/checkout", exigirUsuario, StripeController.criarCheckout);
router.get("/pagamentos/stripe/sessao/:sessionId", exigirUsuario, StripeController.consultarSessao);
router.post("/pagamentos/stripe/sessao/:sessionId/cancelar", exigirUsuario, StripeController.cancelarSessao);

// Gestão de pagamentos (somente administrador)
router.get("/pagamentos", exigirAdmin, PagamentosController.listarPagamentos);
router.post("/pagamentos", exigirAdmin, PagamentosController.cadastrarPagamentos);
router.patch("/pagamentos/:id", exigirAdmin, PagamentosController.editarPagamentos);
router.delete("/pagamentos/:id", exigirAdmin, PagamentosController.apagarPagamentos);

// O webhook do Stripe (POST /webhooks/stripe) fica no index.js, porque
// precisa do corpo da requisição sem passar pelo express.json().


// =====================================================
// PARTICIPANTES DE EQUIPES
// =====================================================

router.get(
    "/participantesEquipes",
    ParticipantesEquipesController.listarParticipantesEquipes
);

router.post(
    "/participantesEquipes",
    ParticipantesEquipesController.cadastrarParticipantesEquipes
);

router.patch(
    "/participantesEquipes/:id",
    ParticipantesEquipesController.editarParticipantesEquipes
);

router.delete(
    "/participantesEquipes/:id",
    ParticipantesEquipesController.apagarParticipantesEquipes
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
router.get("/torneios/:id/participantes", TorneiosController.listarParticipantesDoTorneio);
router.post("/torneios", TorneiosController.cadastrarTorneios);
router.patch("/torneios/:id", TorneiosController.editarTorneios);
router.delete("/torneios/:id", TorneiosController.apagarTorneios);


// =====================================================
// USUÁRIOS
// =====================================================

router.get("/usuarios", UsuariosController.listarUsuarios);
router.post("/usuarios", UsuariosController.cadastrarUsuarios);
router.patch("/usuarios/:id", UsuariosController.editarUsuarios);
router.patch("/usuarios/atualiza-senha/:id", UsuariosController.atualizarSenha);
router.delete("/usuarios/:id", UsuariosController.apagarUsuarios);


module.exports = router;
