const mysql = require("mysql2");

const DB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecoenergix",
});

DB.connect((err) => {
  if (err) {
    console.error("Error de conexión:", err);
    return;
  }
  console.log("Conexión exitosa a MySQL!");
});

module.exports = DB;
