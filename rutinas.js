const db = require('./db');

function getTipoRutinas(req, res) {
  db.many('select sfid, nombre__c from salesforcerotoplas.tiporutina__c')
    .then(function (data) {
      res.status(200).send({ data: data });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'No se encontraron tipos de rutina.'});
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
  var idOperador = req.params.idOperador;
  console.log(idPlanta);
  console.log(idOperador);
  db.many('select * from salesforcerotoplas.rutinas__c where idplanta__c= $1 and usuarioapp__c = $2', [idPlanta, idOperador])
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

function createRutina(req, res) {
  db.none('insert into salesforcerotoplas.rutinas__c(observacion__c, idplanta__c, usuarioapp__c, idtiporutina__c)' +
      'values( ${observacion__c}, ${idplanta__c}, ${usuarioapp__c}, ${idtiporutina__c})',
    req.body)
    .then(function () {
      res.status(200).send({ message: 'La Rutina fue creada correctamente.'});
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Falló al crear la Rutina.'});
      }
    });
}

module.exports = {
  getRutina: getRutina,
  getRutinasUsuario: getRutinasUsuario,
  getPreguntasTipoRutina: getPreguntasTipoRutina,
  createRutina: createRutina,
  getTipoRutinas: getTipoRutinas
};
