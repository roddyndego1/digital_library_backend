const { Pool } = require("pg")

const pool = new Pool({
  //updated connection string
    connectionString: "postgresql://arnold:mYBORE1wuPaNu3JwcIh7ALT2OwOpDfG1@dpg-d4dgjtvpm1nc73daoclg-a.oregon-postgres.render.com/web_tech_students",
    ssl: {
        require: true,
        rejectUnauthorized: false,   
    }
})

pool.on("connect", () => {
    console.log("Connected to Postgres Database")
})
module.exports = pool;
