const { Pool } = require("pg");
const {DATABASEURL} = require("./config");

const pool = new Pool({
  connectionString: DATABASEURL
});

pool.on("error", (err) => {
  console.error("Unexpected Postgres pool error", err);
  process.exit(1);
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {pool, query}