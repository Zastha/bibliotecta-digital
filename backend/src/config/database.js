// Este archivo maneja la conexión a PostgreSQL usando el paquete 'pg'
// Pool = grupo de conexiones reutilizables

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Conectado a PostgreSQL');
    client.release();
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };