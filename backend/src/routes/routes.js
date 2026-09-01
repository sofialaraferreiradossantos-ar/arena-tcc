const express = require('express');
const router = express.Router();

const UsuariosController = require('../controllers/usuarios');
const AgendamentosController = require('../controllers/agendamentos');
const DisponibilidadesController = require('../controllers/disponibilidades');
const EquipesTorneiosController = require('../controllers/equipesTorneios');
const PagamentosController = require('../controllers/pagamentos');
const ParticipantesEquipesController = require('../controllers/participantesEquipes');
const QuadrasController = require('../controllers/quadras');
const TorneiosController = require('../controllers/torneios');


router.get('/agendamentos', AgendamentosController.listarAgendamentos);
router.post('/agendamentos', AgendamentosController.cadastrarAgendamentos);
router.patch('/agendamentos', AgendamentosController.editarAgendamentos);
router.delete('/agendamentos', AgendamentosController.apagarAgendamentos);

router.get('/disponibilidades', DisponibilidadesController.listarDisponibilidades);
router.post('/disponibilidades', DisponibilidadesController.cadastrarDisponibilidades);
router.patch('/disponibilidades', DisponibilidadesController.editarDisponibilidades);
router.delete('/disponibilidades', DisponibilidadesController.apagarDisponibilidades);

router.get('/equipesTorneios', EquipesTorneiosController.listarEquipesTorneios);
router.post('/equipesTorneios', EquipesTorneiosController.cadastrarEquipesTorneios);
router.patch('/equipesTorneios', EquipesTorneiosController.editarEquipesTorneios);
router.delete('/equipesTorneios', EquipesTorneiosController.apagarEquipesTorneios);

router.get('/pagamentos', PagamentosController.listarPagamentos);
router.post('/pagamentos', PagamentosController.cadastrarPagamentos);
router.patch('/pagamentos', PagamentosController.editarPagamentos);
router.delete('/pagamentos', PagamentosController.apagarPagamentos);

router.get('/participantesEquipes', ParticipantesEquipesController.listarParticipantesEquipes);
router.post('/participantesEquipes', ParticipantesEquipesController.cadastrarParticipantesEquipes);
router.patch('/participantesEquipes', ParticipantesEquipesController.editarParticipantesEquipes);
router.delete('/participantesEquipes', ParticipantesEquipesController.apagarParticipantesEquipes);

router.get('/quadras', QuadrasController.listarQuadras);
router.post('/quadras', QuadrasController.cadastrarQuadras);
router.patch('/quadras', QuadrasController.editarQuadras);
router.delete('/quadras', QuadrasController.apagarQuadras);

router.get('/torneios', TorneiosController.listarTorneios);
router.post('/torneios', TorneiosController.cadastrarTorneios);
router.patch('/torneios', TorneiosController.editarTorneios);
router.delete('/torneios', TorneiosController.apagarTorneios);

router.get('/usuarios', UsuariosController.listarUsuarios);
router.post('/usuarios', UsuariosController.cadastrarUsuarios);
router.patch('/usuarios', UsuariosController.editarUsuarios);
router.delete('/usuarios', UsuariosController.apagarUsuarios);


module.exports = router;