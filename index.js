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

// get tokens
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
