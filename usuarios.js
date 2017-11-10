const db = require('./db');
var jwt = require('./services/jwt');
//var bcrypt = require('bcrypt-nodejs'); // encriptar contraseña

// function getAllUsuarios(req, res, next) {
//   db.any('select * from salesforcerotoplas.usuarioapp__c')
//     .then(function (data) {
//       res.status(200)
//         .json({
//           status: 'success',
//           data: data,
//           message: 'Obtiene todos los Usuarios.'
//         });
//     })
//     .catch(function (err) {
//       return next(err);
//     });
//   }

/* endpoint */
function getUsuario(req, res, next) {
  var userID = parseInt(req.params.id);
  db.one('select usuarioapp__c, name, correoelectronicoc__c, activoc__c from salesforcerotoplas.usuarioapp__c where id = $1', userID)
    .then(function (data) {
      res.status(200)
        .json({data: data});
    })
    .catch(function (err) {
      return next(err);
    });
}


function getplantadefault(userId, callback) {
  db.one('select t3.id, t3.name from salesforcerotoplas.usuarioapp__c t1 inner join salesforcerotoplas.usuarioplanta__ch t2 on t1.usuarioapp__c = t2.usuarioapp__c inner join salesforcerotoplas.planta__c t3 on t2.idplanta_fk_heroku=t3.id where t1.usuarioapp__c = $1 and t2.default = true ', userId)
    .then(function(data) {
      callback(data);
    })
    .catch(function(err) {
      callback(err.received); //devuelve 0
    });
}


function logindb(user, pass, callback) {
  db.one('select usuarioapp__c, name, correoelectronicoc__c, activoc__c, tipodeusuario__c from salesforcerotoplas.usuarioapp__c where usuarioapp__c = $1 and contrasenaapp__c = $2', [user, pass])
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
      }else{
        getplantadefault(params.user, function(planta){
          res.status(200).send({
            token: jwt.createToken(data),
            usuario: data,
            planta: planta
          });
        });
      }
  });
}

// function login1(req, res) {
//     var params = req.body;
//     db.one('select name, activoc__c , tipodeusuario__c, correoelectronicoc__c , usuarioapp__c, contrasenaapp__c from salesforcerotoplas.usuarioapp__c  where usuarioapp__c = $1', [params.user, params.pass])
//     .then(function(data){
//         var userId = params.user;
//         var plantaDefault = {};
//         if(data.activoc__c == false){
//             res.status(404).send({message: 'El usuario que ha ingresado esta inactivo. Contacte con el supervisor.'});
//         }else{
//               if(data.contrasenaapp__c != params.pass) {
//                 res.status(404).send({message: 'La contraseña que ha ingresado es incorrecta.'});
//               }else{
//                     getPlantaDefault(userId, function(result){
//                       plantaDefault = result;
//                     });
//
//                     if(params.gethash){
//         							res.status(200).send({
//         								token: jwt.createToken(data) // le pasamos los datos al token
//         							});
//         						}else{
//         							res.status(200).send(
//                         {
//                           user: data,
//                           planta: plantaDefault
//                         }
//                       );
//         						}
//   					      }
//             }
//         }).catch((err, data) => {
//           if(err){
//             if(!data){
//               res.status(404).send({message: 'El usuario que ha ingresado no existe.'});
//             }
//           }
//       });
// }


module.exports = {
  getUsuario: getUsuario,
  login: login
};
