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

router.post("/auth/login", AuthController.login);
router.post("/auth/admin/login", AuthController.adminLogin);
router.post("/auth/admin/cadastro", AuthController.adminCadastro);
router.post("/auth/logout", AuthController.logout);
router.get("/auth/me", AuthController.sessaoAtual);

router.get("/agendamentos", AgendamentosController.listarAgendamentos);
router.post("/agendamentos", AgendamentosController.cadastrarAgendamentos);
router.patch("/agendamentos", AgendamentosController.editarAgendamentos);
router.delete("/agendamentos", AgendamentosController.apagarAgendamentos);

<<<<<<< HEAD
router.get('/disponibilidades', DisponibilidadesController.listarDisponibilidades);
router.post('/disponibilidades', DisponibilidadesController.cadastrarDisponibilidades);
router.patch('/disponibilidades/:id', DisponibilidadesController.editarDisponibilidades);
router.delete('/disponibilidades/:id', DisponibilidadesController.apagarDisponibilidades);
=======
router.get(
  "/disponibilidades",
  DisponibilidadesController.listarDisponibilidades,
);
router.post(
  "/disponibilidades",
  DisponibilidadesController.cadastrarDisponibilidades,
);
router.patch(
  "/disponibilidades",
  DisponibilidadesController.editarDisponibilidades,
);
router.delete(
  "/disponibilidades",
  DisponibilidadesController.apagarDisponibilidades,
);
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b

router.get("/equipesTorneios", EquipesTorneiosController.listarEquipesTorneios);
router.post(
  "/equipesTorneios",
  EquipesTorneiosController.cadastrarEquipesTorneios,
);
router.patch(
  "/equipesTorneios",
  EquipesTorneiosController.editarEquipesTorneios,
);
router.delete(
  "/equipesTorneios",
  EquipesTorneiosController.apagarEquipesTorneios,
);

router.get("/pagamentos", PagamentosController.listarPagamentos);
router.post("/pagamentos", PagamentosController.cadastrarPagamentos);
router.patch("/pagamentos", PagamentosController.editarPagamentos);
router.delete("/pagamentos", PagamentosController.apagarPagamentos);

router.get(
  "/participantesEquipes",
  ParticipantesEquipesController.listarParticipantesEquipes,
);
router.post(
  "/participantesEquipes",
  ParticipantesEquipesController.cadastrarParticipantesEquipes,
);
router.patch(
  "/participantesEquipes",
  ParticipantesEquipesController.editarParticipantesEquipes,
);
router.delete(
  "/participantesEquipes",
  ParticipantesEquipesController.apagarParticipantesEquipes,
);

<<<<<<< HEAD
router.get('/quadras', QuadrasController.listarQuadras);
router.post('/quadras', QuadrasController.cadastrarQuadras);
router.patch('/quadras/:id', QuadrasController.editarQuadras);
router.delete('/quadras/:id', QuadrasController.apagarQuadras);
=======
router.get("/quadras", QuadrasController.listarQuadras);
router.post("/quadras", QuadrasController.cadastrarQuadras);
router.patch("/quadras", QuadrasController.editarQuadras);
router.delete("/quadras", QuadrasController.apagarQuadras);
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b

router.get("/torneios", TorneiosController.listarTorneios);
router.post("/torneios", TorneiosController.cadastrarTorneios);
router.patch("/torneios", TorneiosController.editarTorneios);
router.delete("/torneios", TorneiosController.apagarTorneios);

router.get("/usuarios", UsuariosController.listarUsuarios);
router.post("/usuarios", UsuariosController.cadastrarUsuarios);
router.patch("/usuarios/:id", UsuariosController.editarUsuarios);
router.delete("/usuarios/:id", UsuariosController.apagarUsuarios);

module.exports = router;
