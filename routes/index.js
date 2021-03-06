var express = require('express');
var router = express.Router();
var md_auth = require('../middleware/authenticate')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'El Servidor Web Rotoplas Sytesa Operarios está ejecutándose...' });
});

var queries = require('../queries');
var rutinas = require('../rutinas');
var tickets = require('../tickets');
var usuarios = require('../usuarios');
var plantas = require('../plantas');
var motivos = require('../motivosoportunidades');
var sincronizacionsalesforce = require('../sincronizacionsalesforce');
var configuracion = require('../configuracion');
var clientes = require('../clientes');
var asistencias = require('../asistencias');

var nodemailer = require('../mailer/nodemailer-heroku')

router.post('/api/forgotpassword', nodemailer.forgotpassword);
router.put('/api/updatepassword', nodemailer.updatepassword);
router.post('/api/verifysecuritycode', nodemailer.verifysecuritycode);

//CASE
router.get('/api/ticket/:id',tickets.getCase);
router.get('/api/ticketsusuario/:idPlanta/:idOperador', tickets.getCaseByUser);
router.post('/api/ticket', tickets.createCase);

//LOGIN, USUARIOS Y PLANTAS
router.get('/api/usuarios/:id', usuarios.getUsuario);
router.post('/api/login', usuarios.login);
router.get('/api/plantas',plantas.getAllPlantas);
router.get('/api/plantas/:id', plantas.getPlanta);
router.get('/api/configuracion/:userId', configuracion.getPlantasUsuario);

//RUTINAS
router.post('/api/rutina',rutinas.createRutina);
router.get('/api/rutina/:id', rutinas.getRutina);
router.get('/api/rutinasusuario/:idPlanta/:idOperador', rutinas.getRutinasUsuario);
router.get('/api/preguntastiporutina/:idTipoRutina/:turno', rutinas.getPreguntasTipoRutina);
router.get('/api/tiporutinas', rutinas.getTipoRutinas);
router.get('/api/actividadesrutinas/:id', rutinas.getActividadesRutina);
router.get('/api/rutinadiaria/:idOperador', rutinas.getRutinaDiaria);

//MOTIVOS OPORTUNIDADES Y DESCRIPCIONES.
router.get('/api/motivosoportunidades', motivos.getAllMotivosOportunidades);
router.get('/api/motivosdesestabilizaciones/:id', motivos.getDesestabilizacionByDescripcionId);
router.get('/api/descripcionmotivos/:id', motivos.getDescripcionByMotivoId);

//CLIENTES
router.get('/api/clientesplanta/:idPlanta', clientes.getClientesByPlanta);

//ASISTENCIAS
router.post('/api/asistencia', asistencias.createAsistencia);
router.get('/api/asistenciausuario/:idOperador', asistencias.getAsistenciaUsuario);

//SINCRONIZACION SALESFORCE
router.post('/api/postactividadtest', sincronizacionsalesforce.postActividadTest);
router.post('/api/posttiporutinatest', sincronizacionsalesforce.postTipoRutinaTest);
router.get('/api/loginSalesforce', sincronizacionsalesforce.loginSalesforce);
;

module.exports = router;
