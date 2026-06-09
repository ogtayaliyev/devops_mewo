require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
const connectionString = process.env.DATABASE_URL

app.use(cors())

const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('localhost') || connectionString?.includes('@db:')
    ? false
    : { rejectUnauthorized: false },
})

app.get('/', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevOps Mewo API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      font-family: Inter, system-ui, sans-serif;
      background: linear-gradient(160deg, #f8fafc 0%, #eef2ff 40%, #faf5ff 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem;
      color: #1e293b;
    }
    .card {
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.9);
      border-radius: 1.25rem;
      padding: 2.5rem;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 20px 50px -12px rgba(79,70,229,0.15);
      text-align: center;
    }
    .status {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: #f0fdf4; color: #15803d;
      padding: 0.35rem 0.9rem; border-radius: 999px;
      font-size: 0.8rem; font-weight: 600; margin-bottom: 1.25rem;
    }
    .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
    h1 {
      font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #1e1b4b, #4f46e5, #7c3aed);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    p { color: #64748b; margin-bottom: 2rem; line-height: 1.6; }
    .links { display: flex; flex-direction: column; gap: 0.75rem; }
    a {
      display: block; padding: 0.85rem 1.25rem;
      border-radius: 0.75rem; text-decoration: none;
      font-weight: 600; font-size: 0.95rem; transition: transform 0.2s;
    }
    a:hover { transform: translateY(-2px); }
    .primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
    }
    .secondary {
      background: white; color: #4f46e5;
      border: 1px solid #e2e8f0;
    }
    .footer { margin-top: 2rem; font-size: 0.78rem; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="status"><span class="dot"></span> API OK</div>
    <h1>DevOps Mewo API</h1>
    <p>Backend Express + PostgreSQL déployé sur Render.</p>
    <div class="links">
      <a class="primary" href="${base}/init">/init — Initialiser la base</a>
      <a class="secondary" href="${base}/users">/users — Voir les utilisateurs</a>
    </div>
    <p class="footer">Express · PostgreSQL · Render</p>
  </div>
</body>
</html>`)
})

app.get('/init', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT
      )
    `)
    await pool.query(`
      INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie')
    `)
    res.send('Table users créée (si elle n’existait pas déjà)')
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
