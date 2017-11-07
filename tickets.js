const db = require('./db');

function getAllTickets(req, res, next) {
  db.any('select * from salesforcerotoplas."case"')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Obtiene todos los Tickets.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTicket(req, res, next) {
  var id = parseInt(req.params.id);
  db.one('select * from salesforcerotoplas."case" where id = $1', id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Obtiene un ticket segun su Id.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTicketByUsuario(req,res,next){
  var idPlanta = parseInt(req.params.idPlanta);
  var operador = req.params.operador;
  console.log(idPlanta);
  console.log(operador);
  db.any('select * from salesforcerotoplas.case where idplanta_fk_heroku = $1 and usuarioapp__c = $2', [idPlanta, operador])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
      }).catch((err,data) => {
        if(err){
          if(!data){
            res.status(404).send({message:'No hay tickets registrados para la planta y operador.'});
          }
        }
    });
}

function createTicket(req, res, next) {
  db.none('insert into salesforcerotoplas.case(description, idplanta_fk_heroku, usuarioapp__c)' +
      'values( ${description}, ${idplanta_fk_heroku}, ${usuarioapp__c})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'El ticket fue creado correctamente.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllTickets: getAllTickets,
  getTicket: getTicket,
  getTicketByUsuario: getTicketByUsuario,
  createTicket: createTicket
};
