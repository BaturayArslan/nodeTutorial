const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodeapp", "root", "159951123", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "nodeapp",
//   password: "159951123"
// });

// module.exports = pool.promise();
