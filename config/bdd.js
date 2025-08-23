const mysql  = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

if (process.env.NODE_ENV !== 'test') {
  connection.connect(function(err) {
    if (err) return console.error('error: ' + err.message);
    console.log('Connected as id:' + connection.threadId);
  });
}

const p = connection.promise();

module.exports = { connection, p };