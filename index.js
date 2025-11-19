import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(express.json());

// --- PostgreSQL connection ---
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "personalcms",
});

// --- OPTIONAL function to get all tokens ---
export async function getAllTables() {
  const result = await pool.query("SELECT * FROM tokens");
  console.log(result.rows);
  return result.rows;
}

// --- API route: get tokens ---
app.get("/api/tokens/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tokens");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- Start server ---
app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
