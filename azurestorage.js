var azure = require('azure-storage');
var multiparty = require('multiparty');
var formidable = require('formidable');
var fs = require('fs');

var blobUri = 'https://' + process.env.AZURE_ACCOUNT + '.blob.core.windows.net';
var blobService = azure.createBlobService(process.env.AZURE_CONNECTION_STRING);

/* endpoint */
function crearContainer(req, res) {
  blobService.createContainerIfNotExists(req.body.containername, function(error, result) {
    if (error) {
        res.status(500).send({message: 'azure error create container: ' + error });
    } else {
        res.status(201).send({ message: 'azure container created ' + result.name });
    }
  });
}

/* endpoint */
function createBlockBlobFromStream(req, res) {

  //var form = new multiparty.Form();
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    //console.log("query " + req.query.containername);
    //console.log("nombre del container: " + fields.containername);
    var stream = fs.createReadStream(files.azureupload.path);
    var options = { contentSettings:{contentType:files.azureupload.type }};

    blobService.createContainerIfNotExists(fields.containername, function(error, result) {
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
function listBlobsByContainer(req, res) {

  var urls = [];
  blobService.listBlobsSegmented(req.params.containername, null, function (error, results) {
      if (error) {
          // List blobs error
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

/* endpoint */
function getBlobUrlWithSas(req, res) {

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

  var token = blobService.generateSharedAccessSignature(req.params.containername, req.params.blobname, sharedAccessPolicy);
  var sasUrl = blobService.getUrl(req.params.containername, req.params.blobname, token);
  res.status(200).send({ url: sasUrl });
}

module.exports = {
  listBlobsByContainer: listBlobsByContainer,
  crearContainer: crearContainer,
  createBlockBlobFromStream: createBlockBlobFromStream,
  getBlobUrlWithSas: getBlobUrlWithSas
};
