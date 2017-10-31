const db = require('./db');

function getAllPlantas(req, res, next) {
  db.any('select * from salesforcerotoplas.planta__c')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Obtiene todas las Plantas.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getPlanta(req, res, next) {
  var id = parseInt(req.params.id);
  db.one('select * from salesforcerotoplas.planta__c where id = $1', id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Obtiene una planta segun su Id.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllPlantas: getAllPlantas,
  getPlanta: getPlanta
};
