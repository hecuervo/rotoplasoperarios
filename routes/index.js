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


router.get('/api/rutinas',md_auth.ensureAuth ,rutinas.getAllRutinas);
router.get('/api/tickets',tickets.getAllTickets);
router.get('/api/usuarios', usuarios.getAllUsuarios);
router.get('/api/usuarios/:id', usuarios.getUsuario);
router.post('/api/login', usuarios.login);
router.get('/api/plantas',plantas.getAllPlantas);
router.get('/api/plantas/:id', plantas.getPlanta);


// router.put('/api/puppies/:id', queries.updatePuppy);
// router.delete('/api/puppies/:id', queries.removePuppy);

module.exports = router;
