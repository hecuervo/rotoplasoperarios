const db = require('./db');

function getPlantasUsuario(req,res) {
  var userSfid = req.params.userId;
  db.many('select planta__c_alias.sfid, planta__c_alias.name from salesforcerotoplas.usuarioapp__c usuarioapp__c_alias inner join salesforcerotoplas.usuarioplanta__c usuarioplanta__c_alias on usuarioapp__c_alias.sfid = usuarioplanta__c_alias.usuarioapp__c inner join salesforcerotoplas.planta__c planta__c_alias on usuarioplanta__c_alias.id_planta__c = planta__c_alias.sfid where usuarioplanta__c_alias.usuarioapp__c = $1', userSfid)
    .then(function(data){
      res.status(200).send({
        data: data
      });
     })
   .catch(function (err) {
     if(err.received == 0){
       res.status(404).send({message:'El usuario no tiene plantas asginadas'});
     }else{
       res.status(500).send({message:'Error en el servidor'});
     }
 });
}


module.exports = {
  getPlantasUsuario: getPlantasUsuario
};
