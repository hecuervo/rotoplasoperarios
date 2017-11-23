const db = require('./db');

function getCase(req, res) {
  var id = req.params.id;
  db.one('select * from salesforcerotoplas.case where sfid = $1', id)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'La Oportunidad C que ha solicitado no existe.'});
      }
    });
}

function getCaseByUser(req, res){
  var idPlanta = req.params.idPlanta;
  var operador = req.params.idOperador;
    db.many('select * from salesforcerotoplas.case where idplanta__c = $1 and operadorapp__c = $2', [idPlanta, operador])
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function(err) {
      if(err.received == 0){
        res.status(404).send({message:'No existen Oportunidades C para el operador y la planta indicada.'});
      }
    });
}

function createCase(req, res) {
  db.none('insert into salesforcerotoplas.case(description, enviaagua__c, origin, idplanta__c, operadorapp__c, reason, descripciondefalla__c, motivodedesestabilizacion__c)' +
      'values( ${description}, ${enviaagua__c}, ${origin}, ${idplanta__c}, ${operadorapp__c}, ${reason}, ${descripciondefalla__c}, ${motivodedesestabilizacion__c})',
    req.body)
    .then(function () {
      res.status(200).send({message: 'La Oportunidad C se creó correctamente.'});
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Falló al crear Oportunidad C.'});
      }
    });
}

module.exports = {
  getCase: getCase,
  getCaseByUser: getCaseByUser,
  createCase: createCase
};
