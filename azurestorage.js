var azure = require('azure-storage');

var blobUri = 'https://' + process.env.AZURE_ACCOUNT + '.blob.core.windows.net';
//var blobService = azure.createBlobServiceWithSas(blobUri, 'CJpPJYkveinaoHuhEPAiX3O+lcxqrodGgawgJ0764XJbNjjeUXH6zsuCNffJrPhyaeaGOgXFnmntBmK1gsfRBA==');
var blobService = azure.createBlobService(process.env.AZURE_CONNECTION_STRING);

function createContainerIfNotExists(req, res) {
  blobService.createContainerIfNotExists(req.body.name, function(error, result) {
    if (error) {
        res.status(200).send({message: 'Error ' + error });
    } else {
        res.status(200).send({message: 'OK ' + JSON.stringify(result)});
    }
  });
}


function createBlockBlobFromLocalFile(req, res) {
  blobService.createBlockBlobFromLocalFile('oportunidades', 'taskblob', 'task1-upload.txt', function(error, result, response) {
    if (!error) {
      // file uploaded
      console.info(result);
      console.info(response);
      res.status(200).send({message: 'OK ' + result });
    }else{
      console.info(error);
      res.status(200).send({message: 'Error ' + error });
    }
  });
}

function createBlockBlobFromBrowserFile(req, res) {
  console.info(req.body);
  console.info(req.params.archivo);
  //console.info("REQUEST: " + JSON.stringify(req.files));

  var customBlockSize = req.body.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
  //blobService.singleBlobPutThresholdInBytes = customBlockSize;
  var finishedOrError = false;
  var speedSummary = blobService.createBlockBlobFromBrowserFile('oportunidades', "platense.txt", req.body, {blockSize : customBlockSize}, function(error, result, response) {
      finishedOrError = true;
      if (error) {
          // Upload blob failed
          res.status(200).send({message: 'Error ' + error });
      } else {
          // Upload successfully
          res.status(200).send({message: 'OK ' + result });
      }
  });
}

function listBlobsSegmented(req, res) {
  blobService.listBlobsSegmented('jorge', null, function (error, results) {
      if (error) {
          // List blobs error
          console.info(error);
          res.status(200).send({message: error });
      } else {
          for (var i = 0, blob; blob = results.entries[i]; i++) {
              // Deal with blob object
              console.info(results.entries[i]);
          }
          res.status(200).send({message: 'OK ' + JSON.stringify(results.entries) });
      }
  });
}

module.exports = {
  createBlockBlobFromLocalFile: createBlockBlobFromLocalFile,
  listBlobsSegmented: listBlobsSegmented,
  createBlockBlobFromBrowserFile: createBlockBlobFromBrowserFile,
  createContainerIfNotExists: createContainerIfNotExists
};
