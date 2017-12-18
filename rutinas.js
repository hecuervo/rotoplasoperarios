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
  db.one('select * from salesforcerotoplas.rutinas__c where id_rutinas_heroku__c = $1', idRutina)
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
function getActividadesRutina(req, res){
  var idRutina = req.params.id;
  db.many('SELECT actividadrutina.id_actividadesrutina__c, preguntarutina.name, actividadrutina.valor_si_no__c, actividadrutina.valornumerico__c, actividadrutina.observaciones__c FROM salesforcerotoplas.rutinas__c INNER JOIN salesforcerotoplas.actividadrutina__c as actividadrutina ON (rutinas__c.id_rutinas_heroku__c = actividadrutina.id_rutinas_heroku__c) INNER JOIN salesforcerotoplas.preguntarutina__c as preguntarutina ON (actividadrutina.id_pregunta_rutina__c = preguntarutina.sfid) WHERE rutinas__c.id_rutinas_heroku__c = $1', idRutina)
  .then(function(data){
    res.status(200).send({
        data: data
      });
  }).catch(function(err){
    if(err.received == 0){
        res.status(404).send({message:'No hay actividades registradas para la Rutina seleccionada.'});
    }else{
        res.status(500).send({message:'Error en el servidor: ' + err});
    }
  });
}

/* endpoint */
function getRutinasUsuario(req, res) {
  var idPlanta = req.params.idPlanta;
  var idOperador = req.params.idOperador;
  db.many('select rutinas.id_rutinas_heroku__c , rutinas.name, rutinas.rutaimagen__c, rutinas.observacion__c, rutinas.idtiporutina__c, rutinas.usuarioapp__c, rutinas.idplanta__c, tiposrutina.nombre__c, rutinas.createddate, planta__c_alias.formato__c, planta__c_alias.determinante__c from salesforcerotoplas.rutinas__c as rutinas INNER JOIN salesforcerotoplas.tiporutina__c as tiposrutina ON (rutinas.idtiporutina__c = tiposrutina.sfid) INNER JOIN salesforcerotoplas.planta__c planta__c_alias on (rutinas.idplanta__c = planta__c_alias.sfid) where idplanta__c= $1 and usuarioapp__c = $2 order by rutinas.createddate desc', [idPlanta, idOperador])
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay rutinas registradas para la planta y operador.'});
        }else{
            res.status(500).send({message:'Error en el servidor: ' + err});
        }
    });
}

/* endpoint */
function getPreguntasTipoRutina(req, res) {
  var idTiporutina = req.params.idTipoRutina;
  var turno = req.params.turno;
  db.many('select * from salesforcerotoplas.preguntarutina__c where idtiporutina__c = $1 and turno__c = $2 order by orden__c', [idTiporutina, turno])
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay preguntas registradas para el tipo de rutina seleccionado.'});
        }else{
            res.status(500).send({message:'Error en el servidor ' + err});
        }
    });
}


function createActividadRutina(id_rutinas_heroku__c, actividadesRutina, callback) {
  for(var i in actividadesRutina) {
    db.query('insert into salesforcerotoplas.actividadrutina__c (id_rutinas_heroku__c, id_pregunta_rutina__c,' +
            'valor_si_no__c, valornumerico__c, observaciones__c) values ($1, $2, $3, $4, $5)',
            [id_rutinas_heroku__c, actividadesRutina[i].id_pregunta_rutina__c,
            actividadesRutina[i].valor_si_no__c, actividadesRutina[i].valornumerico__c, actividadesRutina[i].observaciones__c] )
    .then(function(data){
        callback(data, id_rutinas_heroku__c);
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
        createActividadRutina(data[0].id_rutinas_heroku__c, req.body.actividadrutina__c, function(data, id_rutinas_heroku__c){
        res.status(200).send({message: "La Rutina número " + id_rutinas_heroku__c + " y sus Actividades se crearon con éxito.",
                              id_rutina_heroku__c: id_rutinas_heroku__c});
      });
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Se produjo un error al crear la Rutina y sus Actividades. ' + err});
      }
    });
}

/* endpoint */
function getRutinaDiaria (req, res){
  var idOperador = req.params.idOperador;
  db.one("select id_rutinas_heroku__c, createddate from salesforcerotoplas.rutinas__c where usuarioapp__c = $1 and createddate BETWEEN (select DATE 'now') AND (select DATE 'tomorrow') order by createddate desc" , idOperador)
    .then(function (data) {
      res.status(200).send({ data: data });
      }).catch(function(err){
        if(err.received == 0){
          res.status(200).send({ data: [] });
          //res.status(404).send({asistencias:err.received, message:'No se han registrado entradas o salidas en el dia.'});
        }else{
          res.status(500).send({message:'Error en el servidor. ' + err});
        }
    });
}

module.exports = {
  getRutina: getRutina,
  getRutinasUsuario: getRutinasUsuario,
  getPreguntasTipoRutina: getPreguntasTipoRutina,
  createRutina: createRutina,
  getTipoRutinas: getTipoRutinas,
  getActividadesRutina: getActividadesRutina,
  getRutinaDiaria: getRutinaDiaria
};
