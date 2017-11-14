const db = require('./db');


function createActividadRutina(req, res, next) {
  var body = req.body;
  var bodyBoolean = body.valor_si_no__c;
  if(bodyBoolean){
    body.valornumerico__c= null;
  }else{
    body.valor_si_no__c = null;
  }
  db.none('insert into salesforcerotoplas.actividadrutina__c(name, valor_si_no__c, valornumerico__c,id_pregunta_rutina__c,idrutina__c)'+
      'values(${name}, ${valor_si_no__c}, ${valornumerico__c}, ${id_pregunta_rutina__c},${idrutina__c})',
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
      }else{
        res.status(500).send({message:'Error al crear la actividad'});
      }
    });
}

module.exports = {
createActividadRutina: createActividadRutina
}
