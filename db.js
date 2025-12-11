const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }  // REQUIRED for Render PostgreSQL
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL database"))
    .catch(err => console.error("❌ Database connection error:", err));

module.exports = pool;
