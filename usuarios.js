const db = require('./db');
var jwt = require('./services/jwt');
//var bcrypt = require('bcrypt-nodejs'); // encriptar contraseña

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

 function  getPlantasUsuario(userId) {
  db.any('select t1.usuarioapp__c, t1.name, t3.id, t3.name from salesforcerotoplas.usuarioapp__c t1 inner join salesforcerotoplas.usuarioplanta__ch t2 on t1.usuarioapp__c = t2.usuarioapp__c inner join salesforcerotoplas.planta__c t3 on t2.idplanta_fk_heroku=t3.id where t1.usuarioapp__c = $1 ', userId)
    .then(function (data) {
      console.log("plantasUsuario" + JSON.stringify(data));
      return JSON.stringify(data);
    })
      .catch(function (err) {
      return err;
    });
}

function login(req, res,next) {
    var params = req.body;
    db.one('select name, activoc__c , tipodeusuario__c, correoelectronicoc__c , usuarioapp__c, contrasenaapp__c from salesforcerotoplas.usuarioapp__c  where usuarioapp__c = $1', [params.user, params.pass])
    .then(function(data){
        if(data.activoc__c == false){
            res.status(404).send({message: 'El usuario esta inactivo'});
        }else{
              if(data.contrasenaapp__c != params.pass) {
                res.status(404).send({message: 'la contraseña no es válida'});
              }else{
                    var userId = data.usuarioapp__c;
                    var plantasUser = getPlantasUsuario(userId);

                    if(params.gethash){
        							res.status(200).send({
        								token: jwt.createToken(data) // le pasamos los datos al token
        							});
        						}else{
        							res.status(200).send(data);
        						   }
  					      }
            }

        }
  			).catch((err,data) => {

          if(err){
            if(!data){
            res.status(404).send('El usuario no existe');
            //res.status(404).send(err);
            }
          }
      });
  }


module.exports = {
  getAllUsuarios: getAllUsuarios,
  getUsuario: getUsuario,
  login: login
};
