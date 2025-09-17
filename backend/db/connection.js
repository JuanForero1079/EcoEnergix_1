const mysql = require('mysql2');

const DB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',       
  database: 'ecoenergix',
  port: 3306          
});

DB.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL!');
});

module.exports = DB;
