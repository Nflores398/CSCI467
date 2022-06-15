// Use the MariaDB Node.js Connector
var mariadb = require('mariadb');

// Create a connection pool
var pool = mariadb.createPool({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: 'rootpw',
  database: 'orders',
});

// Expose a method to establish connection with MariaDB
module.exports = Object.freeze({
  pool: pool,
});
