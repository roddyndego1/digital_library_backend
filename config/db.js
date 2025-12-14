const { Pool } = require("pg")
require('dotenv').config()

<<<<<<< Updated upstream
const connectionString = process.env.DATABASE_URL || "postgresql://roddy:2PaXKOuM8YDge96y5FI97QyYqblyt43W@dpg-d4jqj63uibrs73f1u0f0-a.oregon-postgres.render.com/student_db_o49n"

const poolConfig = { connectionString }
if (process.env.PGSSLMODE === 'require') {
    poolConfig.ssl = { rejectUnauthorized: false }
}

const pool = new Pool(poolConfig)
=======
const pool = new Pool({
  //updated connection string
    connectionString: "postgresql://roddy:2PaXKOuM8YDge96y5FI97QyYqblyt43W@dpg-d4jqj63uibrs73f1u0f0-a/student_db_o49n",
    ssl: {
        require: true,
        rejectUnauthorized: false,   
    }
})
>>>>>>> Stashed changes

pool.on("connect", () => {
    console.log("Connected to Postgres Database")
})

module.exports = pool;
