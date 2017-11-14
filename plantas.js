const db = require('./db');

function getAllPlantas(req, res, next) {
  db.any('select * from salesforcerotoplas.planta__c')
    .then(function (data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado plantas'});
      }
    });
}

function getPlanta(req, res, next) {
  var id = parseInt(req.params.id);
  db.one('select * from salesforcerotoplas.planta__c where id = $1', id)
    .then(function (data) {
      res.status(200).send({
          data: data,
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'La planta indicada no existe.'});
      }
    });
}

module.exports = {
  getAllPlantas: getAllPlantas,
  getPlanta: getPlanta
};
