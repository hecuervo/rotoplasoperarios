var azure = require('azure-storage');
var multiparty = require('multiparty');
var formidable = require('formidable');
var fs = require('fs');

var blobUri = 'https://' + process.env.AZURE_ACCOUNT + '.blob.core.windows.net';
//var blobService = azure.createBlobServiceWithSas(blobUri, 'CJpPJYkveinaoHuhEPAiX3O+lcxqrodGgawgJ0764XJbNjjeUXH6zsuCNffJrPhyaeaGOgXFnmntBmK1gsfRBA==');
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
  console.log("Container name: " + req.params.containername);
  var urls = [];
  blobService.listBlobsSegmented(req.params.containername, null, function (error, results) {
      if (error) {
          // List blobs error
          //console.info(error);
          res.status(500).send({message: error });
      } else {
          for (var i = 0, blob; blob = results.entries[i]; i++) {
              // Deal with blob object
              //console.info(results.entries[i].name);
              var url = blobService.getUrl(req.params.containername, results.entries[i].name, null, blobUri);
              // var blobUrl = blobService.getBlobUrl(req.params.containername, results.entries[i].name,  { AccessPolicy: {
              //     Start: Date.now(),
              //     Expiry: azure.date.minutesFromNow(60),
              //     Permissions: 'rw'
              // }});
              //
              urls.push(url);
              //console.log("URL: " + url);
          }
          //res.status(200).send({message: 'OK ', blobs: results.entries });
          res.status(200).send({blobs: urls });
      }
  });
}

function getBlob(req, res) {
  var url = blobService.getUrl('skateboarding', '15.jpg', null, blobUri);
  res.status(200).send({ url: url });
  // blobService.getBlobToLocalFile('skateboarding', '15.jpg', '15.jpg', function(error, serverBlob) {
  //   if(!error) {
  //     // Blob available in serverBlob.blob variable
  //     console.log(serverBlob);
  //     res.status(200).send({ blob: serverBlob });
  //   }else{
  //     res.status(500).send({message: 'Error ', error });
  //   }
  // });

  // blobService.getBlobToStream('skateboarding', '4.jpg', fs.createWriteStream('4.jpg'), function(error, result, response) {
  //   if (!error) {
  //     // blob retrieved
  //     console.log(result);
  //     res.status(200).send({message: 'OK ', result, response });
  //   }else{
  //     console.log(error);
  //     res.status(500).send({message: 'Error ', error });
  //   }
  // });
}

// function createBlockBlobFromLocalFile(req, res) {
//     //console.info(req.body.sampleFile);
//     console.info(req.files.sampleFile);
//     blobService.createBlockBlobFromLocalFile('skateboarding', 'subido-de-ionic', 'subido-de-ionic.txt', function(error, result, response) {
//       if (!error) {
//         // file uploaded
//         console.info(result);
//         console.info(response);
//         res.status(200).send({message: 'OK ' + JSON.stringify(result) });
//       }else{
//         console.info(error);
//         res.status(500).send({message: 'Error ' + error });
//       }
//     });
// }
//
// function createBlockBlobFromBrowserFile(req, res) {
//   console.info(req.body);
//   console.info(req.files.sampleFile);
//   console.info("REQUEST: " + JSON.stringify(req.files));
//
//   var customBlockSize = req.body.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
//   //blobService.singleBlobPutThresholdInBytes = customBlockSize;
//   var finishedOrError = false;
//   var speedSummary = blobService.createBlockBlobFromBrowserFile('oportunidades', "platense.txt", req.body, {blockSize : customBlockSize}, function(error, result, response) {
//       finishedOrError = true;
//       if (error) {
//           // Upload blob failed
//           res.status(500).send({message: 'Error ' + error });
//       } else {
//           // Upload successfully
//           res.status(200).send({message: 'OK ' + result });
//       }
//   });
// }

module.exports = {
  //createBlockBlobFromLocalFile: createBlockBlobFromLocalFile,
  //createBlockBlobFromBrowserFile: createBlockBlobFromBrowserFile,
  listBlobsByContainer: listBlobsByContainer,
  crearContainer: crearContainer,
  createBlockBlobFromStream: createBlockBlobFromStream,
  getBlob: getBlob
};
