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
        res.status(200).send({message: 'Error ' + error });
    } else {
        res.status(200).send({message: 'OK ' + JSON.stringify(result)});
    }
  });
}


function createBlockBlobFromLocalFile(req, res) {
    //console.info(req.body.sampleFile);
    console.info(req.files.sampleFile);
    blobService.createBlockBlobFromLocalFile('skateboarding', 'subido-de-ionic', 'subido-de-ionic.txt', function(error, result, response) {
      if (!error) {
        // file uploaded
        console.info(result);
        console.info(response);
        res.status(200).send({message: 'OK ' + JSON.stringify(result) });
      }else{
        console.info(error);
        res.status(200).send({message: 'Error ' + error });
      }
    });
}

function createBlockBlobFromBrowserFile(req, res) {
  console.info(req.body);
  console.info(req.files.sampleFile);
  console.info("REQUEST: " + JSON.stringify(req.files));

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

function createBlockBlobFromStream(req, res) {

  //var form = new multiparty.Form();
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    //console.log(files);
    console.log("path " + files.azureupload.path);
    console.log("name " + files.azureupload.name);
    console.log("size " + files.azureupload.size);

    // var name1 = files[1].name;
    // var name2 = files[2].name;
    // console.log("name1 " + name1);
    // console.log("name2 " + name2);
    var stream = fs.createReadStream(files.azureupload.path);
    var options = {contentSettings:{contentType:'image/jpeg'}};

    blobService.createBlockBlobFromStream('skateboarding', files.azureupload.name, stream, files.azureupload.size, options, function(error){
      if(!error){
          res.send('OK');
      }else{
        res.send('Error');
      }
    });
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
  crearContainer: crearContainer,
  createBlockBlobFromStream: createBlockBlobFromStream
};
