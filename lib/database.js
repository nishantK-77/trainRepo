const mysql = require('mysql2/promise');

// var databaseConnection = mysql.createPool({
// 	host: 'classplus-staging.ccbjnqiu5qm8.ap-south-1.rds.amazonaws.com',
// 	user: 'root',
// 	password: 'd7e5f4b20cce6def7678fb11f5hg217a',
// 	database: 'classplus-staging'
// });

var databaseConnection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'testDatabase'
});
module.exports = databaseConnection;