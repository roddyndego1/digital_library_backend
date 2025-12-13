// Database connection configuration
const { Pool } = require("pg");
require("dotenv").config();

/**
 * Create a PostgreSQL connection pool
 * This manages multiple database connections efficiently
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for cloud databases like Render
  }
});

// Export the pool for use in other files
module.exports = pool;
