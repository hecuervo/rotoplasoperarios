const db = require('./db');
var jwt = require('./services/jwt');

/* endpoint */
function getUsuario(req, res) {
  var userID = parseInt(req.params.id);
  db.one('select usuarioapp__c, name, correoelectronicoc__c, activoc__c from salesforcerotoplas.usuarioapp__c where id = $1', userID)
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


function getplantadefaultdb(userId, callback) {
  db.one('select t3.id, t3.name from salesforcerotoplas.usuarioapp__c t1 inner join salesforcerotoplas.usuarioplanta__ch t2 on t1.usuarioapp__c = t2.usuarioapp__c inner join salesforcerotoplas.planta__c t3 on t2.idplanta__c=t3.sfid where t1.usuarioapp__c = $1 and t2.default = true ', userId)
    .then(function(data) {
      callback(data);
    })
    .catch(function(err) {
      callback(err.received); //devuelve 0
    });
}


function logindb(user, pass, callback) {
  db.one('select usuarioapp__c, name, correoelectronicoc__c, activoc__c, tipousuario__c from salesforcerotoplas.usuarioapp__c where usuarioapp__c = $1 and contrasenaapp__c = $2', [user, pass])
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
        getplantadefaultdb(params.user, function(planta){
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
