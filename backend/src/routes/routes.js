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


// =====================================================
// AUTENTICAÇÃO
// =====================================================

router.post("/auth/login", AuthController.login);
router.post("/auth/logout", AuthController.logout);
router.get("/auth/me", AuthController.sessaoAtual);


// =====================================================
// AGENDAMENTOS
// =====================================================

router.get("/agendamentos", AgendamentosController.listarAgendamentos);
router.post("/agendamentos", AgendamentosController.cadastrarAgendamentos);
router.patch("/agendamentos/:id", AgendamentosController.editarAgendamentos);
router.delete("/agendamentos/:id", AgendamentosController.apagarAgendamentos);


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

router.get("/pagamentos", PagamentosController.listarPagamentos);
router.post("/pagamentos", PagamentosController.cadastrarPagamentos);
router.patch("/pagamentos/:id", PagamentosController.editarPagamentos);
router.delete("/pagamentos/:id", PagamentosController.apagarPagamentos);


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
router.post("/quadras", QuadrasController.cadastrarQuadras);
router.patch("/quadras/:id", QuadrasController.editarQuadras);
router.delete("/quadras/:id", QuadrasController.apagarQuadras);


// =====================================================
// TORNEIOS
// =====================================================

router.get("/torneios", TorneiosController.listarTorneios);
router.post("/torneios", TorneiosController.cadastrarTorneios);
router.patch("/torneios/:id", TorneiosController.editarTorneios);
router.delete("/torneios/:id", TorneiosController.apagarTorneios);


// =====================================================
// USUÁRIOS
// =====================================================

router.get("/usuarios", UsuariosController.listarUsuarios);
router.post("/usuarios", UsuariosController.cadastrarUsuarios);
router.patch("/usuarios/:id", UsuariosController.editarUsuarios);
router.delete("/usuarios/:id", UsuariosController.apagarUsuarios);


module.exports = router;