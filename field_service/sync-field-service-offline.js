const db = require('../db');

function getRecordtypes(req, res) {
    db.many('select sfid, name from ' + process.env.DATABASE_SCHEMA + '.recordtype')
    .then(function (data) {
        res.status(200).send({ data: data });
    }).catch(function(err){
        if(err.received == 0){
          res.status(200).send({message:'No se encontraron registros en la tabla recordtype.'});
        } else {
          res.status(500).send({message:'Error en el servidor'});
      }
    });
}

function getWorktypes(req, res) {
    db.many('select sfid, name from ' + process.env.DATABASE_SCHEMA + '.worktype')
    .then(function (data) {
        res.status(200).send({ data: data });
    }).catch(function(err){
        if(err.received == 0){
          res.status(200).send({message:'No se encontraron registros en la tabla worktype.'});
        } else {
          res.status(500).send({message:'Error en el servidor'});
      }
    });
}

function getActividades(req, res) {
    db.many('select sfid, name, cantidad__c, clavecontrol__c, duracion__c, estatus__c, ordenservicio__c, puesto_detrabajo__c, trabajoreal__c recordtypeid from ' + process.env.DATABASE_SCHEMA + '.actividados__c')
    .then(function (data) {
        res.status(200).send({ data: data });
    }).catch(function(err){
        if(err.received == 0){
          res.status(200).send({message:'No se encontraron registros en la tabla worktype.'});
        } else {
          res.status(500).send({message:'Error en el servidor'});
      }
    });
}

module.exports = {
  getRecordtypes: getRecordtypes,
  getWorktypes: getWorktypes,
  getActividades: getActividades
  // getPlantas: getPlantas,
  // getAccounts: getAccounts,
  // getUsuarios: getUsuarios,
  // getWorkorders: getWorkorders,
  // getCases: getCases,
  // getCitasDeServicio: getCitasDeServicio
};
