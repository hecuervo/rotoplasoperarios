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
var motivos = require('../motivosoportunidades');
var actividadesRutinas = require('../actividadesrutinas');
var sincronizacionsalesforce = require('../sincronizacionsalesforce');
var configuracion = require('../configuracion');



//TICKETS
router.get('/api/tickets',tickets.getAllTickets);
router.get('/api/tickets/:id',tickets.getTicket);
router.get('/api/ticketsusuario/:idPlanta/:operador', tickets.getTicketByUsuario);
router.post('/api/tickets', tickets.createTicket);

//LOGIN,USUARIOS Y PLANTAS
router.get('/api/usuarios/:id', usuarios.getUsuario);
router.post('/api/login', usuarios.login);
router.get('/api/plantas',plantas.getAllPlantas);
router.get('/api/plantas/:id', plantas.getPlanta);
router.get('/api/configuracion/:userId', configuracion.getPlantasUsuario);

//RUTINAS
router.get('/api/rutinas',rutinas.getAllRutinas);
router.get('/api/rutinas/:id', rutinas.getRutina);
router.get('/api/rutinasusuario/:idPlanta/:operador', rutinas.getRutinasUsuario);
router.post('/api/actividadesrutinas', actividadesRutinas.createActividadRutina);
router.get('/api/preguntastiporutina/:idTipoRutina', rutinas.getPreguntasTipoRutina);

//MOTIVOS OPORTUNIDADES Y DESCRIPCIONES.
router.get('/api/motivosoportunidades', motivos.getAllMotivosOportunidades);
router.get('/api/motivosdesestabilizaciones/:id', motivos.getDesestabilizacionByDescripcionId);
router.get('/api/descripcionmotivos/:id', motivos.getDescripcionByMotivoId);

//SINCRONIZACION SALESFORCE
router.post('/api/postactividadtest', sincronizacionsalesforce.postActividadTest);
router.post('/api/posttiporutinatest', sincronizacionsalesforce.postTipoRutinaTest);
router.get('/api/loginSalesforce', sincronizacionsalesforce.loginSalesforce);
;

module.exports = router;
