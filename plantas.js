const db = require('./db');

var config = require('config');
var dbConfig = config.get('dbRotoplas.dbConfig'); // from default.json

function getAllPlantas(req, res) {
  db.many('select * from  ' + dbConfig.schema + '.planta__c')
    .then(function (data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado plantas'});
      }else{
        res.status(500).send({message:'Error en el servidor'});
      }
    });
}

function getPlanta(req, res) {
  var plantaId = req.params.id;
  db.one('select * from  ' + dbConfig.schema + '.planta__c where sfid = $1', plantaId)
    .then(function (data) {
      res.status(200).send({
          data: data,
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'La planta indicada no existe.'});
      }else{
        res.status(500).send({message:'Error en el servidor'});
      }
    });
}

module.exports = {
  getAllPlantas: getAllPlantas,
  getPlanta: getPlanta
};
