const db = require('./db');

function createAsistencia(req, res) {
  console.log(JSON.stringify(req.body));
  db.query('insert into salesforcerotoplas.asistencia__c (tipo__c, usuarioapp__c) values( $1, $2 )',
    [req.body.tipo__c, req.body.usuarioapp__c])
    .then(function (data) {
      res.status(200).send({message: 'La ' + req.body.tipo__c + ' en Planta se realizó con éxito. ' });
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Falló al intentar la ' + req.body.tipo__c + ' en Planta.' + err});
      }
    });
}

/* endpoint */
function getAsistenciaUsuario(req, res) {

  var idOperador = req.params.idOperador;
  db.many("select id_asistencia__c, createddate, tipo__c, usuarioapp__c, name from salesforcerotoplas.asistencia__c where usuarioapp__c = $1 and createddate BETWEEN (select DATE 'now') AND (select DATE 'tomorrow')" , idOperador)
    .then(function (data) {
      res.status(200).send({ data: data });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({asistencias:err.received, message:'No se han registrado entradas o salidas en el dia.'});
        }else{
          res.status(500).send({message:'Error en el servidor. ' + err});
        }
    });
}


module.exports = {
  createAsistencia: createAsistencia,
  getAsistenciaUsuario: getAsistenciaUsuario
};
