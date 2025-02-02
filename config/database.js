const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: process.env.TRUST_SERVER_CERTIFICATE // For local development
  },
  port: 1433
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("Database connected successfully.");
  } catch (err) {
    console.error("Database connection error: ", err);
  }
};

module.exports = { sql, connectDB };