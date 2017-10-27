const initOptions = {
    // global event notification;
    error: (error, e) => {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
};

const pgp = require('pg-promise')(initOptions);
var pgssl = require('pg');
pgssl.defaults.ssl = true;

//HEROKU env const
//var connectionString = process.env.DATABASE_URL;
var connectionString = 'postgres://udc7ioq99go6l:p3dfaacf84a749c063dc39e16a7eccba9c2887d296705cbf55a0e335200d7604e@ec2-34-227-44-8.compute-1.amazonaws.com:5432/d7l7oqmh7mjqoi';
const db = pgp(connectionString);

db.connect()
    .then(obj => {
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

module.exports = db;
