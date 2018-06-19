const db = require('./db');
var jwt = require('./services/jwt');

/* endpoint */
function getUsuario(req, res) {
  var sfid = req.params.id;
  db.one('select sfid, usuarioapp__c, name, correoelectronicoc__c, activoc__c from  ' + process.env.DATABASE_SCHEMA + '.usuarioapp__c where sfid = $1', sfid)
    .then(function (data) {
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

function getUltimaAsistenciaRegistrada(userSfid, callback){
  db.one('SELECT tipo__c, createddate, createddate_heroku__c FROM ' + process.env.DATABASE_SCHEMA + '.asistencia__c WHERE usuarioapp__c = $1 AND createddate_heroku__c NOTNULL ORDER BY createddate_heroku__c DESC LIMIT 1', userSfid)
    .then(function(data) {
          callback(data);
    })
    .catch(function(err) {
      //callback(err.received); //devuelve 0
      callback({'tipo__c': 'Salida'});
    });
}

function getPlantaDefaultdb(userSfid, callback) {
  db.one('select planta__c_alias.sfid, planta__c_alias.name, planta__c_alias.formato__c, planta__c_alias.determinante__c, account_alias.billinglatitude , account_alias.billinglongitude, account_alias.billingcity, account_alias.billingstreet, account_alias.radio__c from ' + process.env.DATABASE_SCHEMA + '.usuarioapp__c usuarioapp__c_alias inner join  ' + process.env.DATABASE_SCHEMA + '.usuarioplanta__c usuarioplanta__c_alias on usuarioapp__c_alias.sfid = usuarioplanta__c_alias.usuarioapp__c inner join  ' + process.env.DATABASE_SCHEMA + '.planta__c planta__c_alias on usuarioplanta__c_alias.id_planta__c = planta__c_alias.sfid inner join  ' + process.env.DATABASE_SCHEMA + '.account account_alias on account_alias.planta_del_del__c = planta__c_alias.sfid where usuarioplanta__c_alias.usuarioapp__c = $1 and usuarioplanta__c_alias.default__c = true group by planta__c_alias.sfid, planta__c_alias.name, planta__c_alias.formato__c, planta__c_alias.determinante__c, account_alias.billinglatitude, account_alias.billinglongitude, account_alias.billingcity, account_alias.billingstreet, account_alias.radio__c LIMIT 1', userSfid)
    .then(function(data) {
      callback(data);
    })
    .catch(function(err) {
      callback(err.received); //devuelve 0
    });
}

function getClientesPlanta(idPlanta, callback){
  db.many('select sfid, name from ' + process.env.DATABASE_SCHEMA + '.account where planta_del_del__c = $1', idPlanta)
    .then(function(data) {
          callback(data);
    })
    .catch(function(err) {
      callback(err.received); //devuelve 0
    });
}

function logindb(user, pass, callback) {
  db.one('select sfid, usuarioapp__c, name, correoelectronicoc__c, activoc__c, tipousuario__c, codigoseguridad__c, aplicacionasignada__c from  ' + process.env.DATABASE_SCHEMA + '.usuarioapp__c where usuarioapp__c = $1 and contrasenaapp__c = $2', [user, pass])
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

        //Viene de la app de Técnicos.
        if(params.aplicacion == process.env.TECNICO){
          if(data.aplicacionasignada__c != process.env.TECNICO){
            res.status(404).send({message: 'No tiene acceso a la aplicación, El Usuario con el que intentó ingresar, tiene como aplicación asignada "' + data.aplicacionasignada__c + '"' });
            return;
          }
          if(data.tipousuario__c == process.env.OPERATOR){
            res.status(404).send({message: 'No tiene acceso a la aplicación, El Usuario con el que intentó ingresar, tiene como tipo de perfil "' + data.tipousuario__c + '"' });
            return;
          }
        }

        //Viene de la app de Operadores.
        //if(params.aplicacion == process.env.OPERATOR){
        if(params.aplicacion == undefined){
          if(data.aplicacionasignada__c != process.env.OPERATOR){
            res.status(404).send({message: 'No tiene acceso a la aplicación. El Usuario con el que intentó ingresar, tiene como aplicación asignada "' + data.aplicacionasignada__c + '"' });
            return;
          }
        }

        if(data.codigoseguridad__c!=null){
          res.status(404).send({message: 'Ingrese el código de seguridad que recibió por correo electrónico.' })
          return;
        }
        if(data.tipousuario__c == process.env.OPERATOR){ ////Si el usuario tiene perfil "Operador"
          getPlantaDefaultdb(data.sfid, function(planta){
            if(planta==0){
              res.status(404).send({message: 'El Usuario que ha ingresado no tiene una planta asociada.'});
              return;
            }
            getClientesPlanta(planta.sfid, function(clientes){
                getUltimaAsistenciaRegistrada(data.sfid, function(asistencia){
                    res.status(200).send({
                      token: jwt.createToken(data),
                      usuario: data,
                      planta: planta,
                      clientes: clientes,
                      asistencia: asistencia
                    });
                })
            })
          });
        } else { //Si el usuario tiene perfil "Técnico"
          res.status(200).send({
            token: jwt.createToken(data),
            usuario: data,
            estadoCrearWorkorder: process.env.WORKORDER_STATUS,
            recordtypeId: process.env.RECORDTYPEID,
            recordtypeDescription: process.env.RECORDTYPEDESCRIPTION,
            estadoInstalacFueraServId: process.env.ESTADO_INSTALAC_FUERA_SERV_ID,
            estadoInstalacionFueraServDesc: process.env.ESTADO_INSTALAC_FUERA_SERV_DESC,
            estadoInstalacEnFuncId: process.env.ESTADO_INSTALAC_EN_FUNC_ID,
            estadoInstalacEnFuncDesc: process.env.ESTADO_INSTALAC_EN_FUNC_DESC,
            worktypeidCorrectivo: process.env.WORKTYPEID_CORRECTIVO,
            worktypeidCorrectivoDescripcion: process.env.WORKTYPEID_CORRECTIVO_DESCRIPCION
          });
        }
      }
  });
}

module.exports = {
  getUsuario: getUsuario,
  login: login
};
