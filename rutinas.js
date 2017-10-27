const db = require('./db');

// add query functions
function getAllRutinas(req, res, next) {
  db.any('select * from salesforcerotoplas.rutinas__c')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Obtiene todas las Rutinas.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllRutinas: getAllRutinas
};
