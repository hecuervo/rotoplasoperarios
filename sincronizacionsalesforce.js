const db = require('./db');
var https = require('https');

var username = 'desarrollo@rotoplas.com.desarrollo';
var password = 'sal3sforcetandilEyso4acRGWh3MwFxo4m3sO7U';
clientId = '3MVG9AzPSkglhtpsxfvVKovjnOeTVIYnBoFZe6jrEW.1LkhDWsCVjnFjgCG4GOSd8EOMxNdXH8yKOTTTj2GRf';
clientSecret = '8524502280722798143';

function performRequest(host, endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = null;

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  } else {
      //JORGE DACEV: HARDCODE DE PRUEBA!!!
      if(host == 'test.salesforce.com'){ //DOMINIO DE LOGIN, necesita form-urlencoded
          headers = {
              "content-type": "application/x-www-form-urlencoded",
              "Content-Length": dataString.length
            };
      } else { //DOMINIO DE ALTA DE ACTIVIDADES POR EJEMPLO, necesita application/json
          headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
          };
      }
    };
    //console.log(headers);

  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    console.log("encabezados: " + JSON.stringify(options.headers));
    res.setEncoding('utf-8');
    var responseString = '';
    //console.log("grant_type: " + data.grant_type);

    console.log("data: " + JSON.stringify(data));
    var pepe = JSON.stringify(data);
    res.on('data', function(pepe) {
      console.info("data " + pepe);
      responseString += pepe;
    });

    res.on('end', function() {
      console.log("responseString " + JSON.stringify(responseString));
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

function hola (id){
    return [{
            "hola" : id,
            "chau" : id

          }];
}

function loginSalesforce() {
  var aaa = hola(7878787878787);
  console.log("aaa " + JSON.stringify(aaa));

  performRequest('test.salesforce.com', '/services/oauth2/token', 'POST', {
    "grant_type": "password",
    "client_id": "3MVG9AzPSkglhtpsxfvVKovjnOeTVIYnBoFZe6jrEW.1LkhDWsCVjnFjgCG4GOSd8EOMxNdXH8yKOTTTj2GRf",
    "client_secret": "8524502280722798143",
    "username": "desarrollo@rotoplas.com.desarrollo",
    "password": "sal3sforcetandilEyso4acRGWh3MwFxo4m3sO7U"
  }, function(data) {
      console.log("loginSalesforce performRequest" + JSON.stringify(data));
      //getCards();
  });
}

function postActividadesTestSalesforce(idtiporutina, nombre, idsalesforce) {
    console.info('datos de actividades enviados a salesforcerotoplas');
    console.info(idtiporutina);
    console.info(nombre);
    console.info(idsalesforce);

    performRequest('cs96.salesforce.com', '/services/apexrest/Actividades', 'PUT',
      {
        nombre: nombre,
        idsalesforce: idsalesforce
      }, function(data) {
          //sessionId = data.result.id;
          //console.log(sessionId);
          console.log("postActividadesTestSalesforce performRequest" + data);
      });
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
  postTipoRutinaTest: postTipoRutinaTest,
  loginSalesforce: loginSalesforce
};
