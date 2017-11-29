const db = require('./db');
var jwt = require('./services/jwt');

/* endpoint */
function getUsuario(req, res) {
  var sfid = req.params.id;
  db.one('select sfid, usuarioapp__c, name, correoelectronicoc__c, activoc__c from salesforcerotoplas.usuarioapp__c where sfid = $1', sfid)
    .then(function (data) {
      console.log(data);
        res.status(200).send({
          data: data
      });
    })
    .catch(function(err) {
      if(err.received == 0){
        res.status(404).send({message:'El usuario no existe'});
      }
    });
}


function getPlantaDefaultdb(userSfid, callback) {
  db.one('select planta__c_alias.sfid, planta__c_alias.name, planta__c_alias.formato__c, planta__c_alias.determinante__c from salesforcerotoplas.usuarioapp__c usuarioapp__c_alias inner join salesforcerotoplas.usuarioplanta__c usuarioplanta__c_alias on usuarioapp__c_alias.sfid = usuarioplanta__c_alias.usuarioapp__c inner join salesforcerotoplas.planta__c planta__c_alias on usuarioplanta__c_alias.id_planta__c = planta__c_alias.sfid where usuarioplanta__c_alias.usuarioapp__c = $1 and usuarioplanta__c_alias.default__c = true ', userSfid)
    .then(function(data) {
      callback(data);
    })
    .catch(function(err) {
      callback(err.received); //devuelve 0
    });
}


function logindb(user, pass, callback) {
  db.one('select sfid, usuarioapp__c, name, correoelectronicoc__c, activoc__c, tipousuario__c, codigoseguridad__c from salesforcerotoplas.usuarioapp__c where usuarioapp__c = $1 and contrasenaapp__c = $2', [user, pass])
    .then(function(data){
        callback(data);
    })
    .catch(function(err) {
        callback(err.received); //devuelve 0
    });
}

/* endpoint */
function login(req, res){
  var params = req.body;
  logindb(params.user, params.pass, function(data){
      if(data==0){
        res.status(404).send({message: 'El Usuario o la Contraseña que ha ingresado es incorrecta.'});
        return;
      }else{
        if(!data.activoc__c){
          res.status(404).send({message: 'El Usuario que ha ingresado está inactivo.'});
          return;
        }
        if(data.codigoseguridad__c!=null){
          res.status(200).send({message: 'Ingrese el código que se le fue enviado por correo electrónico' })
          return;
        }
        getPlantaDefaultdb(data.sfid, function(planta){
          if(planta==0){
            res.status(404).send({message: 'El Usuario que ha ingresado no tiene una planta asociada.'});
            return;
          }
          res.status(200).send({
            token: jwt.createToken(data),
            usuario: data,
            planta: planta
          });
        });
      }
  });
}

module.exports = {
  getUsuario: getUsuario,
  login: login
};
