const { Pool } = require("pg")
require('dotenv').config()

const connectionString = process.env.DATABASE_URL 

const poolConfig = { connectionString }
if (process.env.PGSSLMODE === 'require') {
    poolConfig.ssl = { rejectUnauthorized: false }
}

const pool = new Pool(poolConfig)

pool.on("connect", () => {
    console.log("Connected to Postgres Database")
})

module.exports = pool;
