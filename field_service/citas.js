const db = require('../db');

function getEstadosCitas(req, res){
  res.status(200).send( {data: process.env.ESTADOS_CITAS} );
}

function getCitasByMesAnioTecnico(req, res) {
  var mes = req.params.mes;
  var anio = req.params.anio;
  var usuarioapp__c = req.params.idTecnico;
  db.many('SELECT * FROM ' + process.env.DATABASE_SCHEMA + '.citas_de_servicio__c INNER JOIN ' + process.env.DATABASE_SCHEMA + '.workorder on (' + process.env.DATABASE_SCHEMA + '.workorder.sfid = ' + process.env.DATABASE_SCHEMA + '.citas_de_servicio__c.ordenservicio__c) WHERE EXTRACT(MONTH FROM inicio_programado__c) = $1 and EXTRACT(year FROM inicio_programado__c) = $2 and ' + process.env.DATABASE_SCHEMA + '.workorder.usuarioapp__c = $3 ', [mes, anio, usuarioapp__c])
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
