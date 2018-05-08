const db = require('../db');

function getCita(req, res) {
  var id = req.params.id;
  db.one('SELECT worktypeid, accountid, city, subject, durationtype FROM  ' + process.env.DATABASE_SCHEMA + '.workorder WHERE id = $1', id)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'La Cita que ha solicitado no existe.'});
      }
    });
}

module.exports = {
  getCita: getCita
};
