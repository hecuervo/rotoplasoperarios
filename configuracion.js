const db = require('./db');

function getPlantasUsuario(userId) {
 db.any('select t1.usuarioapp__c, t1.name, t3.id, t3.name from salesforcerotoplas.usuarioapp__c t1 inner join salesforcerotoplas.usuarioplanta__ch t2 on t1.usuarioapp__c = t2.usuarioapp__c inner join salesforcerotoplas.planta__c t3 on t2.idplanta_fk_heroku=t3.id where t1.usuarioapp__c = $1 ', userId)
   .then(function (data) {

     console.log(data);
     return data;
   })
   .catch(function (err) {
   return err;
 });
}


module.exports = {
  getPlantasUsuario: getPlantasUsuario
};
