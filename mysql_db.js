const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createConnection({//Подключение к бд mysql
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
  });

module.exports = pool;