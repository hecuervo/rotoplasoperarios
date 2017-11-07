var express = require('express');
var router = express.Router();
var md_auth = require('../middleware/authenticate')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'El Servidor Web Rotoplas Operarios está ejecutándose...' });
});

var queries = require('../queries');
var rutinas = require('../rutinas');
var tickets = require('../tickets');
var usuarios = require('../usuarios');
var plantas = require('../plantas');
var sincronizacionsalesforce = require('../sincronizacionsalesforce');


router.get('/api/rutinas',md_auth.ensureAuth ,rutinas.getAllRutinas);
router.get('/api/tickets',tickets.getAllTickets);
router.get('/api/ticketsusuario/:idPlanta/:operador', tickets.getTicketByUsuario);
router.post('/api/tickets', tickets.createTicket);
router.get('/api/usuarios', usuarios.getAllUsuarios);
router.get('/api/usuarios/:id', usuarios.getUsuario);
router.post('/api/login', usuarios.login);
router.get('/api/plantas',plantas.getAllPlantas);
router.get('/api/plantas/:id', plantas.getPlanta);
router.get('/api/rutinas/:id', rutinas.getRutina);
router.get('/api/rutinasusuario/:idPlanta/:operador', rutinas.getRutinasUsuario);
router.get('/api/preguntastiporutina/:idTipoRutina', rutinas.getPreguntasTipoRutina);


router.post('/api/postactividadtest', sincronizacionsalesforce.postActividadTest);
router.post('/api/posttiporutinatest', sincronizacionsalesforce.postTipoRutinaTest);
router.get('/api/loginSalesforce', sincronizacionsalesforce.loginSalesforce);
// router.put('/api/puppies/:id', queries.updatePuppy);
// router.delete('/api/puppies/:id', queries.removePuppy);

module.exports = router;
