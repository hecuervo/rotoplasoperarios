const db = require('./db');

var config = require('config');
var dbConfig = config.get('dbRotoplas.dbConfig'); // from default.json

function getCase(req, res) {
  var id = req.params.id;
  db.one('SELECT id_case_heroku_c__c, origin, casenumber, motivodedesestabilizacion__c, "case".createddate, subject status, enviaagua__c, descripciondefalla__c, reason, description, clientes.name as nombrecliente FROM  ' + dbConfig.schema + '.case INNER JOIN  ' + dbConfig.schema + '.account as clientes ON ("case".accountid = clientes.sfid) WHERE "case".id_case_heroku_c__c = $1', id)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'La Oportunidad C que ha solicitado no existe.'});
      }
    });
}

function getCaseByUser(req, res){
  var idPlanta = req.params.idPlanta;
  var operador = req.params.idOperador;
    db.many('select * from  ' + dbConfig.schema + '.case where idplanta__c = $1 and operadorapp__c = $2 order by createddate desc', [idPlanta, operador])
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function(err) {
      if(err.received == 0){
        res.status(404).send({message:'No existen Oportunidades C para el operador y la planta indicada.'});
      }
    });
}

function createCase(req, res) {
  db.query('insert into  ' + dbConfig.schema + '.case(description, enviaagua__c, origin, idplanta__c, operadorapp__c, accountid, createddate_heroku__c , motivo_oportunidad_c_lookup__c, descripcion_de_falla_lookup__c, motivo_de_desestabilizacion_lookup__c)' +
      'values( ${description}, ${enviaagua__c}, ${origin}, ${idplanta__c}, ${operadorapp__c}, ${accountid}, ${createddate_heroku__c} , ${motivo_oportunidad_c_lookup__c}, ${descripcion_de_falla_lookup__c}, ${motivo_de_desestabilizacion_lookup__c}) RETURNING id_case_heroku_c__c',
    req.body)
    .then(function (data) {
      res.status(200).send({message: 'Se Creó Oportunidad C número ' + data[0].id_case_heroku_c__c,
                            id_case_heroku_c__c: data[0].id_case_heroku_c__c }
                          );
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Falló al crear Oportunidad C. ' + err});
      }
    });
}

module.exports = {
  getCase: getCase,
  getCaseByUser: getCaseByUser,
  createCase: createCase
};
