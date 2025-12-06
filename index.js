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
    const result = await pool.query("SELECT * FROM base_entity");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get a table from the database
app.get("/api/:tableName", async (req, res) => {
  const tableName = req.params.tableName;
  try {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get a list of tokens with all regions
app.get("/api/tokenContainer/:containerId", async (req, res) => {
  const containerId = req.params.containerId;

  try {
    const result = await pool.query(`SELECT 
      c.id AS container_id,
      c.name AS container_name,
      json_agg(
          json_build_object(
              'id', t.id,
              'enus', t.enus,
              'enes', t.enes
          )
      ) AS tokens
      FROM containers c
      LEFT JOIN container_tokens ct ON c.id = ct.container_id
      LEFT JOIN tokens t ON t.id = ct.token_id
      WHERE c.id = '${containerId}'
      GROUP BY c.id, c.name;`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
// Get a list of tokens but only the region wanted
app.get("/api/tokenContainer/:containerId/:region", async (req, res) => {
  const containerId = req.params.containerId;
  const region = req.params.region;
  console.log(region);
  try {
    const result = await pool.query(`SELECT 
        c.id AS container_id,
        c.name AS container_name,
        json_agg(
            json_build_object(
                'id', t.id,
                'token_id',t.token_id,
                '${region}', t.${region},
            )
        ) AS tokens
        FROM containers c
        LEFT JOIN container_tokens ct ON c.id = ct.container_id
        LEFT JOIN tokens t ON t.id = ct.token_id
        WHERE c.id = '${containerId}'
        GROUP BY c.id, c.name;`);
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
