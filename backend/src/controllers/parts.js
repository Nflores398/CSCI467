var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'blitz.cs.niu.edu',
  database: 'csci467',
  user: 'student',
  password: 'student',
});

connection.connect();

module.exports = {
  getAll: async (result) => {
    connection.query('SELECT * FROM parts', function (err, rows) {
      if (err) throw err;
      result(rows);
    });
  },
};
