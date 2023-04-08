require("dotenv").config();

module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.DB_AWS_HOST,
    port: process.env.DB_AWS_PORT,
    database: process.env.DB_AWS_DATABASE,
    user: process.env.DB_AWS_USER,
    password: process.env.DB_AWS_PASSWORD,
  },
};
