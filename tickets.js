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

module.exports = {
  getAllTickets: getAllTickets
};
