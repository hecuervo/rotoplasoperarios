const db = require('../db');

function getWorkOrdersbyTecnico(req, res) {
  var idTecnico = req.params.idTecnico;
  db.many('SELECT * FROM ' + process.env.DATABASE_SCHEMA + '.workorder WHERE usuarioapp__c = $1', idTecnico)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'No hay ordenes de servicio para el mostrar.'});
      }
    });
}

function getWorkOrderbyId(req, res) {
  var id = req.params.id;
  db.one('SELECT * FROM ' + process.env.DATABASE_SCHEMA + '.workorder WHERE sfid = $1', id)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'La Orden de servicio que ha solicitado no existe.'});
      }
    });
}

function crearWorkorder(req, res) {
  db.query('INSERT INTO  ' + process.env.DATABASE_SCHEMA + '.workorder(subject, centroplanificacion__c, accountid, description, elementopep__c, status, estadoinstalacion__c, priority, worktypeid )' +
      'values( $1, $2, $3, $4, $5, $6, $7, $8, $9 )',
    [req.body.subject, req.body.centroplanificacion__c, req.body.accountid, req.body.description, req.body.elementopep__c, process.env.WORKORDER_STATUS, req.body.estadoinstalacion__c, req.body.priority, process.env.WORKTYPEID])
    .then(function (data) {
      res.status(200).send({message: 'La órden de servicio se creó con éxito.'});
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Falló al crear órden de servicio. ' + err});
      }
    });
}

module.exports = {
  getWorkOrdersbyTecnico: getWorkOrdersbyTecnico,
  getWorkOrderbyId: getWorkOrderbyId,
  crearWorkorder: crearWorkorder
};
