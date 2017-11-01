const db = require('./db');
var jwt = require('./services/jwt');
var bcrypt = require('bcrypt-nodejs'); // encriptar contraseña

function getAllUsuarios(req, res, next) {
  db.any('select * from salesforcerotoplas.usuarioapp__c')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Obtiene todos los Usuarios.'
        });
        console.log(data);
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

function login(req, res,next) {
  var params = req.body;
  db.one('select name, activoc__c , correoelectronicoc__c ,usuarioapp__c, contrasenaapp__c, id , ownerid from salesforcerotoplas.usuarioapp__c where usuarioapp__c = $1', [params.user, params.pass])
  .then(function (data){
      data.activoc__c = 'true';
      if(data.activoc__c == false){
          res.status(404).send({message: 'El usuario esta inactivo'});
      }else{
            if(data.contrasenaapp__c != params.pass) {
              res.status(404).send({message: 'la contraseña no es válida'});
            }
  					else{
              if(params.gethash){
  							res.status(200).send({
  								token: jwt.createToken(data) // le pasamos los datos al token
  							});
  						}else{
  							res.status(200).send({data});
  						     }
					    }
          }
			}).catch((err,data) => {

        if(err){ // si usuario no existe
          if(!data){
          res.status(404).send({message:'el usuario no existe'});
        }
        }
      });
  }


    /*  res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Logged in'
        });
      /* jshint ignore:end

    .catch(function (err) {
      return next(err);
    });*/

    /*function login(req, res) {
      var params = req.body;
      var user = params.user;
      var pass = params.pass;
      db.one('select name, correoelectronicoc__c , contrasenaapp__c, id ,ownerid, usuarioapp__c from salesforcerotoplas.usuarioapp__c where usuarioapp__c = $1 and contrasenaapp__c = $2',[user,pass],(userlog) =>{
      /*if(){   // si pasa algun error en la peticion
    			res.status(500).send({message: 'Error en la petición.'});
          console.log(data);
          console.log(err);
    		}*/
        //else{
    			/*if(!userlog){ // si usuario no existe
    				res.status(404).send(QueryResultError.message);

    			}else{
    				//bcrypt.compare(pass,userlog.contrasenaapp__c,function(err,check){ // compara la contraseña encriptada
    					if(userlog.contrasenaapp__c){
    						if(params.gethash){//devolver un token de jwt. get hash crea un tokens con las credenciales
    						// aca devolvemos una respuest http y este gethash nos decodificara el token y comprobar si es correcto o no, y de esta menera treaera los datos del usuario.
    							res.status(200).send({
    								//propiedad token q llama al servicio jwt
    								token: jwt.createToken(userlog) // le pasamos los datos al token
    							});
                    console.log(userlog.name);
    						}else{
    							res.status(200).send({userlog});
                  console.log(userlog);
    						}
    					}else{
    						res.status(404).send({message:'la contraseña no es valida'})
                console.log(userlog);
    					}
    				}
          }).catch((err) => {
                console.log(err);
              });
    			}*/


module.exports = {
  getAllUsuarios: getAllUsuarios,
  getUsuario: getUsuario,
  login: login
};
