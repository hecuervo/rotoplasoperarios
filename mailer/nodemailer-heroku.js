var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: 'key-efa6e6989ca64a65ee2c4aecf4ef535d',
    domain: 'sandbox31540e7949194389b6ba35fcd8fb443a.mailgun.org'
  }
}

//TODO: Jorge Dacev, falta agregar el codigo que inserte el valor random que se acaba de generar en el campo
//codigoseguridad__c en la tabla usuariosapp__c
function updateCodigoSeguridad(codigoSeguridad){

}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

function codigoDeSeguridad () {
  return Math.floor(Math.random() * (1000000));
}

function forgotpassword(req, res) {
  let codigoSeguridad = codigoDeSeguridad();
  nodemailerMailgun.sendMail({
    from: 'operarios@rotoplas.com',
    to: req.body.correoelectronicoc__c, // An array if you have multiple recipients.
    subject: 'Rotoplas Operarios - Solicitud para modificar contraseña',
    text: 'Ha solicitado un nuevo código de seguridad para cambiar su contraseña.\nEl código que deberá ingresar en la aplicación móvil para modificar su contraseña es: ' + codigoSeguridad,
  }, function (err, info) {
    if (err) {
      console.log('Error: ' + err);
      res.status(404).send({message: 'Error al enviar el código de seguridad a su cuenta de correo electrónico.'});
    } else {
      updateCodigoSeguridad(codigoSeguridad);
      console.log('Response: ' + JSON.stringify(info));
      res.status(200).send({message: 'Revise su cuenta de correo electrónico en unos minutos.\n Donde encontrará el código de seguridad que ha solicitado.'});
    }
  });
}

module.exports = {
  forgotpassword: forgotpassword
};
