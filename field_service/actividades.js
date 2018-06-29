const db = require('../db');


/// --and actividades. estatus__c <> 'Cerrado'
function getActividadesByWorkorderId(req, res) {
  var id = req.params.workorderId;
  db.many("SELECT actividades.sfid, actividades.name, actividades.cantidad__c, actividades.claveControl__c, actividades.puesto_detrabajo__c, actividades.recordtypeid, recordtypes.name as tipo_registro, actividades.estatus__c FROM  " + process.env.DATABASE_SCHEMA + ".actividados__c as actividades INNER JOIN " + process.env.DATABASE_SCHEMA + ".workorder as workorders on workorders.sfid = actividades.ordenservicio__c LEFT JOIN " + process.env.DATABASE_SCHEMA + ".recordtype as recordtypes on recordtypes.sfid = actividades.recordtypeid WHERE actividades.ordenservicio__c = $1 and actividades.estatus__c <> 'Cerrada'", id)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'No hay actividades para mostrar.'});
      }
    });
}


function getActividadById(req, res) {
  var id = req.params.id;
  db.one('SELECT plantas.sfid as id_planta, plantas.name as nombre_planta, accounts.sfid as id_cliente, accounts.name as nombre_cliente, usuarios.name as tecnico_asignado, workorders.workordernumber, actividades.name as nombre_actividad, actividades.sfid, actividades.cantidad__c, actividades.clavecontrol__c, actividades.duracion__c, actividades.Estatus__c, actividades.OrdenServicio__c, actividades.PuestoTrabajo__c, actividades.TrabajoReal__c, workorders.worktypeid, worktypes.name as tipo_trabajo, workorders.RecordTypeId, recordtypes.name as tipo_registro FROM ' + process.env.DATABASE_SCHEMA + '.actividados__c as actividades INNER JOIN ' + process.env.DATABASE_SCHEMA + '.workorder as workorders on workorders.sfid = actividades.ordenservicio__c INNER JOIN ' + process.env.DATABASE_SCHEMA + '.account as accounts on accounts.sfid = workorders.accountid INNER JOIN ' + process.env.DATABASE_SCHEMA + '.planta__c plantas on accounts.planta_del_del__c = plantas.sfid LEFT JOIN ' + process.env.DATABASE_SCHEMA + '.usuarioapp__c as usuarios on usuarios.sfid = workorders.usuarioapp__c INNER JOIN ' + process.env.DATABASE_SCHEMA + '.worktype as worktypes on worktypes.sfid = workorders.worktypeid INNER JOIN ' + process.env.DATABASE_SCHEMA + '.recordtype as recordtypes on recordtypes.sfid = actividades.recordtypeid WHERE actividades.sfid = $1', id)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'La Actividad que ha solicitado no existe.'});
      }
    });
  }

  function modificarActividad(req, res) {
    db.query('UPDATE ' + process.env.DATABASE_SCHEMA + '.actividados__c SET trabajoreal__c = ($1), estatus__c = ($2) WHERE sfid = ($3)',
      [req.body.trabajoreal__c, req.body.estatus__c, req.body.sfid])
      .then(function (data) {
          res.status(200).send({message: 'La actividad se actualizó con éxito.' });
      })
      .catch(function(err) {
        if(err){
          res.status(404).send({message:'Falló al actualizar la actividad. ' + err});
        }
      });
  }

module.exports = {
  getActividadesByWorkorderId: getActividadesByWorkorderId,
  getActividadById: getActividadById,
  modificarActividad: modificarActividad
};
