const db = require('./db');

// add query functions
function getAllRutinas(req, res, next) {
  db.any('select * from salesforcerotoplas.rutinas__c')
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'No se encontraron rutinas.'});
        }
    });
}

function getRutina(req, res, next) {
  var idRutina = parseInt(req.params.id);
  db.one('select * from salesforcerotoplas.rutinas__c where id = $1', idRutina)
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'No existe la rutina requerida.'});
        }
    });
}

function getRutinasUsuario(req, res, next) {
  var idPlanta = parseInt(req.params.idPlanta);
  var operador = req.params.operador;
  console.log(idPlanta);
  console.log(operador);
  db.any('select * from salesforcerotoplas.rutinas__c where idplanta_fk_heroku = $1 and operador__c = $2', [idPlanta, operador])
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay rutinas registradas para la planta y operador.'});
        }
    });
}

function getPreguntasTipoRutina(req, res, next) {
  var idTiporutina = parseInt(req.params.idTipoRutina);
  db.any('select * from salesforcerotoplas.preguntarutina__c where idtiporutina_fk_heroku = $1', idTiporutina)
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay preguntas registradas para el tipo de rutina seleccionado.'});
        }
    });
}

module.exports = {
  getAllRutinas: getAllRutinas,
  getRutina: getRutina,
  getRutinasUsuario: getRutinasUsuario,
  getPreguntasTipoRutina: getPreguntasTipoRutina
};
