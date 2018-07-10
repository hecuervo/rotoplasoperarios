var azure = require('azure-storage');
var multiparty = require('multiparty');
var formidable = require('formidable');
var fs = require('fs');

var blobUri = 'https://' + process.env.AZURE_ACCOUNT + '.blob.core.windows.net';
var blobService = azure.createBlobService(process.env.AZURE_CONNECTION_STRING);

/* endpoint */
/* crea el contenedor, si no existe, y luego sube la imagen a dicho contenedor */
function crearContenedorSubirImagen(req, res) {

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields);
    console.log('como llega:', fields.metadata)
    
    var stream = fs.createReadStream(files.azureupload.path);
    var options = { 
      contentSettings:{contentType:files.azureupload.type },
      metadata: JSON.parse(fields.metadata)
    };
    
    console.log('options:', JSON.stringify(options));
    blobService.createContainerIfNotExists(fields.containername, {publicAccessLevel:'blob'}, function(error, result) {
      if (error) {
          res.status(500).send({message:'Se produjo un error en la conexión con Azure: ' + error });
      } else {
        blobService.createBlockBlobFromStream(fields.containername, files.azureupload.name, stream, files.azureupload.size, options, function(error){
          if(!error){
              res.status(200).send({message: 'La imágen se guardó correctamente.' });
          }else{
              res.status(500).send({message: 'Se produjo un error al guardar la imágen. ' + error} );
          }
        });
      }
    });
  });
}

/* endpoint */
/* Dado el nombre de un container, arma una lista de todos los archivos que contiene dicho container */
function listarImagenesPorContenedor(req, res) {

  var urls = [];
  blobService.listBlobsSegmented(req.params.containername, null, function (error, results) {
      if (error) {
          res.status(500).send({message: error });
      } else {
          for (var i = 0, blob; blob = results.entries[i]; i++) {
              var startDate = new Date();
              var expiryDate = new Date(startDate);
              expiryDate.setMinutes(startDate.getMinutes() + 100);
              startDate.setMinutes(startDate.getMinutes() - 100);

              var sharedAccessPolicy = {
                AccessPolicy: {
                  Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                  Start: startDate,
                  Expiry: expiryDate
                }
              };

              var token = blobService.generateSharedAccessSignature(req.params.containername, results.entries[i].name, sharedAccessPolicy);
              var sasUrl = blobService.getUrl(req.params.containername, results.entries[i].name, token);
              urls.push(sasUrl);
          }
          res.status(200).send({blobs: urls });
      }
  });
}


module.exports = {
  listarImagenesPorContenedor: listarImagenesPorContenedor,
  crearContenedorSubirImagen: crearContenedorSubirImagen
};
