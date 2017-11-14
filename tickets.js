const db = require('./db');

function getAllTickets(req, res) {
  db.any('select * from salesforcerotoplas."case"')
    .then(function (data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'No se han encontrado tickets'});
      }
    });
}

function getTicket(req, res) {
  var id = parseInt(req.params.id);
  db.one('select * from salesforcerotoplas.case where id = $1', id)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'El ticket que ha solicitado no existe'});
      }
    });
}

function getTicketByUsuario(req, res){
  var idPlanta = parseInt(req.params.idPlanta);
  var operador = req.params.operador;
    db.any('select * from salesforcerotoplas.case where id_planta_heroku__c = $1 and usuarioapp_heroku__c = $2', [idPlanta, operador])
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function(err) {
      if(err.received == 0){
        res.status(404).send({message:'No existen tickets para el usuario y la planta indicada.'});
      }
    });
}

function createTicket(req, res) {
  db.none('insert into salesforcerotoplas.case(description, createddate, id_planta_heroku__c, usuarioapp_heroku__c)' +
      'values( ${description}, ${createddate}, ${id_planta_heroku__c}, ${usuarioapp_heroku__c})',
    req.body)
    .then(function () {
      res.status(200).send({
          status: 'success',
          message: 'El ticket fue creado correctamente.'
        });
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'EL ticket "NO" se ha generado correctamente'});
      }
    });
}

module.exports = {
  getAllTickets: getAllTickets,
  getTicket: getTicket,
  getTicketByUsuario: getTicketByUsuario,
  createTicket: createTicket
};
