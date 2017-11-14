const db = require('./db');

// add query functions
function getAllRutinas(req, res) {
  db.many('select * from salesforcerotoplas.rutinas__c')
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'No se encontraron rutinas.'});
        }else{
          res.status(500).send({message:'Error en el servidor'});
        }
    });
}

function getRutina(req, res) {
  var idRutina = req.params.id;
  db.one('select * from salesforcerotoplas.rutinas__c where sfid = $1', idRutina)
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'La rutina solicitada no existe.'});
        }else{
          res.status(500).send({message:'Error en el servidor'});
        }
    });
}

function getRutinasUsuario(req, res) {
  var idPlanta = req.params.idPlanta;
  var operador = req.params.operador;
  console.log(idPlanta);
  console.log(operador);
  db.many('select * from salesforcerotoplas.rutinas__c where idplanta__c= $1 and usuarioapp__c = $2', [idPlanta, operador])
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay rutinas registradas para la planta y operador.'});
        }else{
            res.status(500).send({message:'Error en el servidor'});
        }
    });
}

function getPreguntasTipoRutina(req, res) {
  var idTiporutina = req.params.idTipoRutina;
  db.many('select * from salesforcerotoplas.preguntarutina__c where idtiporutina__c = $1', idTiporutina)
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay preguntas registradas para el tipo de rutina seleccionado.'});
        }else{
            res.status(500).send({message:'Error en el servidor'});
        }
    });
}

module.exports = {
  getAllRutinas: getAllRutinas,
  getRutina: getRutina,
  getRutinasUsuario: getRutinasUsuario,
  getPreguntasTipoRutina: getPreguntasTipoRutina
};
