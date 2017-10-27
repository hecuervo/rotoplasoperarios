const db = require('./db');

function getAllUsuarios(req, res, next) {
  db.any('select * from salesforcerotoplas.usuarioapp__c')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Obtiene todos los Usuarios.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getUsuario(req, res, next) {
  var userID = parseInt(req.params.id);
  db.one('select usuarioapp__c, name, correoelectronicoc__c, activoc__c from salesforcerotoplas.usuarioapp__c where id = $1', userID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Obtiene un usuario.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function login(req, res, next) {
  db.one('select name, correoelectronicoc__c from salesforcerotoplas.usuarioapp__c where usuarioapp__c = $1 and contrasenaapp__c = $2', [req.body.user, req.body.pass])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Logged in'
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllUsuarios: getAllUsuarios,
  getUsuario: getUsuario,
  login: login
};
