const db = require('../db');

function getEstadosCitas(req, res){
  res.status(200).send( {data: process.env.ESTADOS_CITAS} );
}

function getCitasByMesAnioTecnico(req, res) {
  var mes = req.params.mes;
  var anio = req.params.anio;
  var usuarioapp__c = req.params.idTecnico;
  db.many('SELECT citasservicios.sfid as id_cita_servicio, plantas.name as nombre_planta, accounts.name as nombre_cliente, citasservicios.estatus__c, citasservicios.createddate, citasservicios.asunto__c, usuarios.name FROM ' + process.env.DATABASE_SCHEMA + '.citas_de_servicio__c as citasservicios INNER JOIN ' + process.env.DATABASE_SCHEMA + '.workorder as workorders on workorders.sfid = citasservicios.ordenservicio__c inner join ' + process.env.DATABASE_SCHEMA + '.account as accounts on accounts.sfid = workorders.accountid inner join ' + process.env.DATABASE_SCHEMA + '.planta__c plantas on accounts.planta_del_del__c = plantas.sfid INNER JOIN ' + process.env.DATABASE_SCHEMA + '.usuarioapp__c as usuarios on usuarios.sfid = workorders.usuarioapp__c WHERE EXTRACT(MONTH FROM citasservicios.inicio_programado__c) = $1 and EXTRACT(year FROM citasservicios.inicio_programado__c) = $2 and workorders.usuarioapp__c = $3 ', [mes, anio, usuarioapp__c])
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
  db.one('SELECT * FROM  ' + process.env.DATABASE_SCHEMA + '.citas_de_servicio__c WHERE sfid = $1', id)
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
