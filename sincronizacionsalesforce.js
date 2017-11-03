const db = require('./db');


function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

function postActividadesTestSalesforce(idtiporutina, nombre, idsalesforce) {
    console.info('datos de actividades enviados a salesforcerotoplas');
    console.info(idtiporutina);
    console.info(nombre);
    console.info(idsalesforce);
  // performRequest('ACA_VA_LA_URL_DE_SALESFORCE', 'POST', {
  //   idtiporutina: idtiporutina,
  //   nombre: nombre,
  //   idsalesforce: idsalesforce
  // }, function(data) {
  //     sessionId = data.result.id;
  //     console.log(sessionId);
  // });
}


function postTipoRutinaTest(req, res, next) {
  db.none('insert into salesforcerotoplas.tiporutinatest(nombre, idsalesforce)'
        + 'values(${nombre}, ${idsalesforce})', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function postActividadTest(req, res, next) {

  postActividadesTestSalesforce(req.body.idtiporutina, req.body.nombre, req.body.idsalesforce);

  var id = parseInt(req.params.id);
  db.none('insert into salesforcerotoplas.actividadestest(idtiporutina, nombre, idsalesforce)'
        + 'values(${idtiporutina}, ${nombre}, ${idsalesforce})', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  postActividadTest: postActividadTest,
  postTipoRutinaTest: postTipoRutinaTest
};
