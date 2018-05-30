const db = require('../db');

function getEstadosWorkorder(req, res){
  res.status(200).send( {data: process.env.ESTADOS_WORKORDER} );
}

function getWorkOrdersbyTecnico(req, res) {
  var idTecnico = req.params.idTecnico;
  db.many("SELECT workorders.workordernumber, worktypes.name as tipo_de_trabajo, workorders.startdate, accounts.name as nombre_cliente, workorders.priority, workorders.status, workorders.claveorden__c, workorders.sfid as workorder_id, plantas.name as nombre_planta, workorders.subject, workorders.description, workorders.worktypeid FROM " + process.env.DATABASE_SCHEMA + ".workorder as workorders INNER JOIN " + process.env.DATABASE_SCHEMA + ".usuarioapp__c as usuarios on usuarios.sfid = workorders.usuarioapp__c INNER JOIN " + process.env.DATABASE_SCHEMA + ".account as accounts on accounts.sfid = workorders.accountid INNER JOIN " + process.env.DATABASE_SCHEMA + ".planta__c plantas on accounts.planta_del_del__c = plantas.sfid INNER JOIN " + process.env.DATABASE_SCHEMA + ".worktype as worktypes on worktypes.sfid = workorders.worktypeid WHERE workorders.usuarioapp__c = $1 and (workorders.status <> 'Completado' and workorders.status <> 'Cerrado' and workorders.status <> 'Cancelado')", idTecnico)
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
  db.one('SELECT workorders.sfid as workorder_id, planta__c_alias.name as nombre_planta, account_alias.name as nombre_cliente, workorders.status, workorders.startdate, workorders.workordernumber, workorders.priority, workorders.subject, workorders.description, workorders.worktypeid, worktypes.name as tipo_de_trabajo, workorders.claveorden__c FROM ' + process.env.DATABASE_SCHEMA + '.workorder as workorders INNER JOIN ' + process.env.DATABASE_SCHEMA + '.usuarioapp__c as usuarios on usuarios.sfid = workorders.usuarioapp__c inner join  ' + process.env.DATABASE_SCHEMA + '.usuarioplanta__c usuarioplanta__c_alias on usuarios.sfid = usuarioplanta__c_alias.usuarioapp__c inner join  ' + process.env.DATABASE_SCHEMA + '.planta__c planta__c_alias on usuarioplanta__c_alias.id_planta__c = planta__c_alias.sfid inner join  ' + process.env.DATABASE_SCHEMA + '.account account_alias on account_alias.planta_del_del__c = planta__c_alias.sfid inner join ' + process.env.DATABASE_SCHEMA + '.worktype as worktypes on worktypes.sfid = workorders.worktypeid WHERE workorders.sfid = $1', id)
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

// me falta agregar el usuarioapp__c
function crearWorkorder(req, res) {
  db.query('INSERT INTO  ' + process.env.DATABASE_SCHEMA + '.workorder(subject, centroplanificacion__c, accountid, description, status, estadoinstalacion__c, priority, worktypeid, recordtypeid, usuarioapp__c )' +
      'values( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )',
    [req.body.subject, req.body.centroplanificacion__c, req.body.accountid, req.body.description, process.env.WORKORDER_STATUS, req.body.estadoinstalacion__c, req.body.priority, req.body.worktypeid, process.env.RECORDTYPEID, req.body.usuarioapp__c])
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
  crearWorkorder: crearWorkorder,
  getEstadosWorkorder: getEstadosWorkorder
};
