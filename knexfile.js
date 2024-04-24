require("dotenv").config();

module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.DB_RAILWAY_HOST,
    port: process.env.DB_RAILWAY_PORT,
    database: process.env.DB_RAILWAY_DATABASE,
    user: process.env.DB_RAILWAY_USER,
    password: process.env.DB_RAILWAY_PASSWORD,
  },
};
