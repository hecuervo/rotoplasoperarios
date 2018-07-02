const db = require('../db');

function getEstadosCitas(req, res){
  res.status(200).send( {data: process.env.ESTADOS_CITAS} );
}

function getCitasByMesAnioTecnico(req, res) {
  var mes = req.params.mes;
  var anio = req.params.anio;
  var semana = req.params.semana;
  var usuarioapp__c = req.params.idTecnico;
  var sql = `
    SELECT 
      citasservicios.name as nombre_cita, 
      citasservicios.estatus__c, 
      citasservicios.inicio_programado__c, 
      accounts.name as nombre_cliente, 
      plantas.name as nombre_planta, 
      citasservicios.asunto__c, 
      usuarios.name as tecnico_asignado, 
      citasservicios.sfid as id_cita_servicio, 
      citasservicios.createddate 
    FROM ${process.env.DATABASE_SCHEMA}.citas_de_servicio__c as citasservicios 
      INNER JOIN ${process.env.DATABASE_SCHEMA}.workorder as workorders on workorders.sfid = citasservicios.ordenservicio__c 
      INNER JOIN ${process.env.DATABASE_SCHEMA}.account as accounts on accounts.sfid = workorders.accountid 
      INNER JOIN ${process.env.DATABASE_SCHEMA}.planta__c plantas on plantas.sfid = accounts.planta_del_del__c 
      LEFT JOIN ${process.env.DATABASE_SCHEMA}.usuarioapp__c as usuarios on usuarios.sfid = workorders.usuarioapp__c 
    WHERE EXTRACT(${semana == undefined ? 'MONTH' : 'WEEK'} FROM citasservicios.inicio_programado__c) = '${semana == undefined ? mes : semana}' 
      and EXTRACT(year FROM citasservicios.inicio_programado__c) = '${anio}' 
      and citasservicios.ordenservicio__c IN (select sfid from ${process.env.DATABASE_SCHEMA}.workorder where usuarioapp__c = '${usuarioapp__c}') 
      and (
            citasservicios.estatus__c <> 'Completado' 
            and citasservicios.estatus__c <> 'Cerrado' 
            and citasservicios.estatus__c <> 'Cancelado' 
            and citasservicios.estatus__c <> 'No se puede completar'
          )`;
  db.many(sql)
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
        res.status(404).send({message:'No hay ordenes de servicio para mostrar.'});
      }
    });
}

function getCitaById(req, res) {
  var id = req.params.id;
  db.one('SELECT plantas.sfid as id_planta, plantas.name as nombre_planta, accounts.sfid as id_cliente, accounts.name as nombre_cliente, accounts.billinglatitude , accounts.billinglongitude, usuariosjoinworkorder.name as tecnico_asignado, workorders.workordernumber, citasservicios.name as nombre_cita, citasservicios.inicio_programado__c, workorders.worktypeid, worktypes.name as tipo_trabajo, citasservicios.asunto__c, citasservicios.descripcion__c, citasservicios.estatus__c, citasservicios.comentarios__c, citasservicios.sfid as id_cita_servicio, workorders.centroplanificacion__c, workorders.estadoinstalacion__c FROM ' + process.env.DATABASE_SCHEMA + '.citas_de_servicio__c as citasservicios INNER JOIN ' + process.env.DATABASE_SCHEMA + '.workorder as workorders on workorders.sfid = citasservicios.ordenservicio__c INNER JOIN ' + process.env.DATABASE_SCHEMA + '.account as accounts on accounts.sfid = workorders.accountid INNER JOIN ' + process.env.DATABASE_SCHEMA + '.planta__c plantas on accounts.planta_del_del__c = plantas.sfid INNER JOIN ' + process.env.DATABASE_SCHEMA + '.usuarioapp__c as usuariosjoinworkorder on usuariosjoinworkorder.sfid = workorders.usuarioapp__c INNER JOIN ' + process.env.DATABASE_SCHEMA + '.worktype as worktypes on worktypes.sfid = workorders.worktypeid WHERE citasservicios.sfid = $1', id)
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

function modificarCita(req, res) {
  db.query('UPDATE ' + process.env.DATABASE_SCHEMA + '.citas_de_servicio__c SET estatus__c = ($1), comentarios__c = ($2) WHERE sfid = ($3)',
    [req.body.estatus__c, req.body.comentarios__c, req.body.cita_de_servicio__c_sfid])
    .then(function (data) {

      // Actualiza la ultima geolocalización del técnico en donde modificó la cita de servicio //
      db.query('UPDATE ' + process.env.DATABASE_SCHEMA + '.usuarioapp__c SET ultimaubicacion__latitude__s = ($1), ultimaubicacion__longitude__s = ($2) WHERE sfid = ($3)',
        [req.body.ultimaubicacion__latitude__s, req.body.ultimaubicacion__longitude__s, req.body.usuarioapp__c_sfid])
        .then(function (data) {
            //Geolocalización actualizada con éxito.
            //res.status(200).send({message: 'La ubicación del técnico se actualizó con éxito.' });
        })
        .catch(function(err) {
          if(err){
            res.status(404).send({message:'Falló al actualizar la ubicación del técnico. ' + err});
          }
        });
      /////////////////////////////////////////////////////////
      res.status(200).send({message: 'La cita de servicio y la última ubicación del técnico se actualizaron con éxito.' });
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
  modificarCita: modificarCita,
  getEstadosCitas: getEstadosCitas
};
