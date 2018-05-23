const db = require('../db');

function getEstadosCitas(req, res){
  res.status(200).send( {data: process.env.ESTADOS_CITAS} );
}

function getCitasByMesAnioTecnico(req, res) {
  var mes = req.params.mes;
  var anio = req.params.anio;
  var usuarioapp__c = req.params.idTecnico;
  db.many("SELECT citasservicios.name as nombre_cita, citasservicios.estatus__c, citasservicios.inicio_programado__c, accounts.name as nombre_cliente, plantas.name as nombre_planta, citasservicios.asunto__c, usuariosjoincitas.name as tecnico_asignado, citasservicios.sfid as id_cita_servicio, citasservicios.createddate FROM salesforcerotoplas.citas_de_servicio__c as citasservicios INNER JOIN salesforcerotoplas.workorder as workorders on workorders.sfid = citasservicios.ordenservicio__c inner join salesforcerotoplas.account as accounts on accounts.sfid = workorders.accountid inner join salesforcerotoplas.planta__c plantas on accounts.planta_del_del__c = plantas.sfid INNER JOIN salesforcerotoplas.usuarioapp__c as usuariosjoinworkorder on usuariosjoinworkorder.sfid = workorders.usuarioapp__c INNER JOIN salesforcerotoplas.usuarioapp__c as usuariosjoincitas on usuariosjoincitas.sfid = citasservicios.tecnico_asignado__c WHERE EXTRACT(MONTH FROM citasservicios.inicio_programado__c) = $1 and EXTRACT(year FROM citasservicios.inicio_programado__c) = $2 and workorders.usuarioapp__c = $3 and (citasservicios.estatus__c <> 'Completado' and citasservicios.estatus__c <> 'Cerrado' and citasservicios.estatus__c <> 'Cancelado')", [mes, anio, usuarioapp__c])
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'No hay citas para mostrar en el período seleccionado.'});
      }
    });
}

function getCitasByWorkorderId(req, res) {
  var id = req.params.workorderId;
  db.many('SELECT * FROM  ' + process.env.DATABASE_SCHEMA + '.citas_de_servicio__c WHERE ordenservicio__c = $1', id)
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

function getCitaById(req, res) {
  var id = req.params.id;
  db.one('SELECT plantas.name as nombre_planta, accounts.name as nombre_cliente, usuariosjoincitas.name as tecnico_asignado, workorders.workordernumber, citasservicios.name as nombre_cita, citasservicios.inicio_programado__c, workorders.worktypeid, worktypes.name as tipo_trabajo, citasservicios.asunto__c, citasservicios.descripcion__c, citasservicios.estatus__c, citasservicios.comentarios__c, citasservicios.sfid as id_cita_servicio FROM salesforcerotoplas.citas_de_servicio__c as citasservicios INNER JOIN salesforcerotoplas.workorder as workorders on workorders.sfid = citasservicios.ordenservicio__c inner join salesforcerotoplas.account as accounts on accounts.sfid = workorders.accountid inner join salesforcerotoplas.planta__c plantas on accounts.planta_del_del__c = plantas.sfid INNER JOIN salesforcerotoplas.usuarioapp__c as usuariosjoinworkorder on usuariosjoinworkorder.sfid = workorders.usuarioapp__c INNER JOIN salesforcerotoplas.usuarioapp__c as usuariosjoincitas on usuariosjoincitas.sfid = citasservicios.tecnico_asignado__c INNER JOIN salesforcerotoplas.worktype as worktypes on worktypes.sfid = workorders.worktypeid WHERE citasservicios.sfid = $1', id)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'La Cita que ha solicitado no existe.'});
      }
    });
}

function actualizarCita(req, res) {
  db.query('UPDATE ' + process.env.DATABASE_SCHEMA + '.citas_de_servicio__c SET estatus__c = ($1), comentarios__c = ($2) WHERE sfid = ($3)',
    [req.body.estatus__c, req.body.comentarios__c, req.body.sfid])
    .then(function (data) {
      res.status(200).send({message: 'La cita de servicio se modificó con éxito.' }
                          );
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Falló al modificar la cita de servicio. ' + err});
      }
    });
}

module.exports = {
  getCitaById: getCitaById,
  getCitasByWorkorderId: getCitasByWorkorderId,
  getCitasByMesAnioTecnico: getCitasByMesAnioTecnico,
  actualizarCita: actualizarCita,
  getEstadosCitas: getEstadosCitas
};
