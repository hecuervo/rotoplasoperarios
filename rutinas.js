const db = require('./db');

function getTipoRutinas(req, res) {
  db.many('select sfid, nombre__c from salesforcerotoplas.tiporutina__c')
    .then(function (data) {
      res.status(200).send({ data: data });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'No se encontraron tipos de rutina.'});
        }else{
          res.status(500).send({message:'Error en el servidor'});
        }
    });
}

/* endpoint */
function getRutina(req, res) {
  var idRutina = req.params.id;
  db.one('select * from salesforcerotoplas.rutinas__c where sfid = $1', idRutina)
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'La rutina solicitada no existe.'});
        }else{
          res.status(500).send({message:'Error en el servidor'});
        }
    });
}

/* endpoint */
function getRutinasUsuario(req, res) {
  var idPlanta = req.params.idPlanta;
  var idOperador = req.params.idOperador;
  db.many('select rutinas.name, rutinas.rutaimagen__c, rutinas.observacion__c, rutinas.idtiporutina__c, rutinas.usuarioapp__c, rutinas.idplanta__c, tiposrutina.nombre__c from salesforcerotoplas.rutinas__c as rutinas INNER JOIN salesforcerotoplas.tiporutina__c as tiposrutina ON (rutinas.idtiporutina__c = tiposrutina.sfid) where idplanta__c= $1 and usuarioapp__c = $2', [idPlanta, idOperador])
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay rutinas registradas para la planta y operador.'});
        }else{
            res.status(500).send({message:'Error en el servidor'});
        }
    });
}

/* endpoint */
function getPreguntasTipoRutina(req, res) {
  var idTiporutina = req.params.idTipoRutina;
  db.many('select * from salesforcerotoplas.preguntarutina__c where idtiporutina__c = $1', idTiporutina)
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay preguntas registradas para el tipo de rutina seleccionado.'});
        }else{
            res.status(500).send({message:'Error en el servidor'});
        }
    });
}


function createActividadRutina(id_rutinas_heroku__c, actividadesRutina, callback) {
    console.log(JSON.stringify(actividadesRutina));
  for(var i in actividadesRutina) {
    db.query('insert into salesforcerotoplas.actividadrutina__c (id_rutinas_heroku__c, id_pregunta_rutina__c,' +
            'valor_si_no__c, valornumerico__c) values ($1, $2, $3, $4)',
            [id_rutinas_heroku__c, actividadesRutina[i].id_pregunta_rutina__c,
            actividadesRutina[i].valor_si_no__c, actividadesRutina[i].valornumerico__c] )
    .then(function(data){
        callback(data);
    })
    .catch(function(err){
      callback(err);
    });
  }
}

/* endpoint */
function createRutina(req, res) {
  db.query('insert into salesforcerotoplas.rutinas__c(observacion__c, idplanta__c, usuarioapp__c, idtiporutina__c, rutaimagen__c)' +
      'values( ${observacion__c}, ${idplanta__c}, ${usuarioapp__c}, ${idtiporutina__c}, ${rutaimagen__c}) RETURNING id_rutinas_heroku__c',
    req.body)
    .then(function (data) {
        createActividadRutina(data[0].id_rutinas_heroku__c, req.body.actividadrutina__c, function(data){
        res.status(200).send({message: "La Rutina y sus Actividades se crearon con éxito."});
      });
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Se produjo un error al crear la Rutina y sus Actividades. ' + err});
      }
    });
}

module.exports = {
  getRutina: getRutina,
  getRutinasUsuario: getRutinasUsuario,
  getPreguntasTipoRutina: getPreguntasTipoRutina,
  createRutina: createRutina,
  getTipoRutinas: getTipoRutinas
};
