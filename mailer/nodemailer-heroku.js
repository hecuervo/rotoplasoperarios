const db = require('../db');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var config = require('config');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var dbConfigMailer = config.get('mailer.dbConfigMailer'); // from default.json

var auth = {
  auth: {
    api_key: dbConfigMailer.key,
    domain: dbConfigMailer.domain
  }
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));


function updateSecCode(codigoseguridad__c, usuarioapp__c){
  db.query('update salesforcerotoplas.usuarioapp__c set codigoseguridad__c= $1 where usuarioapp__c= $2',[
    codigoseguridad__c, usuarioapp__c])
    .then(function (data) {
        //console.log(data);
        return;
    })
    .catch(function(err) {
      if(err){
        console.log("updateSecCode " + err);
        return;
      }
    });
}

function genSecurityCode () {
  return Math.floor(Math.random() * (1000000));
}

/* endpoint */
function updatepassword(req, res){
  db.query('update salesforcerotoplas.usuarioapp__c set codigoseguridad__c = NULL, contrasenaapp__c = $1 where usuarioapp__c = $2',[
    req.body.contrasenaapp__c, req.body.usuarioapp__c])
    .then(function (data) {
        res.status(200).send({message: "La contraseña se modificó con exito."});
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Se produjo un error al modificar la contraseña.\n Info: ' + err});
      }
    });
}

/* endpoint */
function verifysecuritycode(req, res){
  db.one('select codigoseguridad__c from salesforcerotoplas.usuarioapp__c where usuarioapp__c = $1 and codigoseguridad__c = $2',
      [req.body.usuarioapp__c, req.body.codigoseguridad__c])
    .then(function (data) {
        res.status(200).send({message: "El código de seguridad coincide.", canchangepassword: true});
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'El código de seguridad ingresado, no coincide con el código que se le fue enviado por correo electrónico.', canchangepassword: false});
      }
    });
}

/* endpoint */
function forgotpassword(req, res) {
  let codigoSeguridad = genSecurityCode();
  nodemailerMailgun.sendMail({
    from: 'sytesa@rotoplas.com',
    to: req.body.correoelectronicoc__c, // An array if you have multiple recipients.
    subject: 'Operadores Sytesa - Solicitud para modificar contraseña',
    text: 'Ha solicitado un nuevo código de seguridad para modificar su contraseña.\nEl código que deberá ingresar en la aplicación móvil para modificar su contraseña es: ' + codigoSeguridad,
  }, function (err, info) {
    if (err) {
      res.status(404).send({message: 'Error al enviar el código de seguridad a su cuenta de correo electrónico.'});
    } else {
      updateSecCode(codigoSeguridad, req.body.usuarioapp__c);
      console.info('Response: ' + JSON.stringify(info));
      res.status(200).send({message: 'Revise su cuenta de correo electrónico en unos minutos.\n Donde encontrará el código de seguridad que ha solicitado.'});
    }
  });
}

module.exports = {
  forgotpassword: forgotpassword,
  updatepassword: updatepassword,
  verifysecuritycode: verifysecuritycode
};
