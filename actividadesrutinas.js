const db = require('./db');


function createActividadRutina(req, res, next) {
  var body = req.body;
  var bodyBoolean = body.valor_si_no__c;
  if(bodyBoolean){
    body.valornumerico__c= null;
  }else{
    body.valor_si_no__c = null;
  }
  db.none('insert into salesforcerotoplas.actividadrutina__c(name, valor_si_no__c, valornumerico__c, idrutina_fk_heroku)'+
      'values(${name}, ${valor_si_no__c}, ${valornumerico__c}, ${idtiporutina_fk_heroku})',
    body)
    .then(function () {
      res.status(200).send({
          status: 'success',
          message: 'La actividad ha sido creada con éxito'
        });
   })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'La actividad no se ha podido crear correctamente.'});
      }
    });
}

module.exports = {
createActividadRutina: createActividadRutina
}
