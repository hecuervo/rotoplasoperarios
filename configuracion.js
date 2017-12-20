const db = require('./db');

/* endpoint */
function getPlantasUsuario(req, res) {
  var userSfid = req.params.userId;
  db.many('select planta__c_alias.sfid, planta__c_alias.name, planta__c_alias.formato__c, planta__c_alias.determinante__c, account_alias.billinglatitude , account_alias.billinglongitude, account_alias.billingcity, account_alias.billingstreet from salesforcerotoplas.usuarioapp__c usuarioapp__c_alias inner join salesforcerotoplas.usuarioplanta__c usuarioplanta__c_alias on usuarioapp__c_alias.sfid = usuarioplanta__c_alias.usuarioapp__c inner join salesforcerotoplas.planta__c planta__c_alias on usuarioplanta__c_alias.id_planta__c = planta__c_alias.sfid inner join salesforcerotoplas.account account_alias on account_alias.planta_del_del__c = planta__c_alias.sfid where usuarioplanta__c_alias.usuarioapp__c = $1', userSfid)
    .then(function(data){
      res.status(200).send({ data: data });
     })
   .catch(function (err) {
     if(err.received == 0){
       res.status(404).send({message:'El usuario no tiene plantas asociadas.'});
     }else{
       res.status(500).send({message:'Error en el servidor'});
     }
 });
}

module.exports = {
  getPlantasUsuario: getPlantasUsuario
};
