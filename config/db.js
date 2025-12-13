const { Pool } = require("pg")

const pool = new Pool({
    connectionString: "postgresql://roddy:2PaXKOuM8YDge96y5FI97QyYqblyt43W@dpg-d4jqj63uibrs73f1u0f0-a.oregon-postgres.render.com/student_db_o49n",
    ssl: {
        require: true,
        rejectUnauthorized: false,   
    }
})

pool.on("connect", () => {
    console.log("Connected to Postgres Database")
})
module.exports = pool;
