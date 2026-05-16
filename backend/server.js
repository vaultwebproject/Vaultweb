const path    = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Database pool ─────────────────────────────────────────────────────────────

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:            process.env.DB_PORT     || 3306,
  database:        process.env.DB_NAME     || 'audit-trail',
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  waitForConnections: true,
});

pool.getConnection()
  .then(conn => {
    console.log(`MySQL connected → ${process.env.DB_NAME}`);
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection failed:', err.message);
    process.exit(1);
  });

// ── Helper ────────────────────────────────────────────────────────────────────

const clientIp = (req) =>
  (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

// ── Organisations ─────────────────────────────────────────────────────────────

// POST /organisations/create
app.post('/organisations/create', async (req, res) => {
  const { name, admin_email } = req.body;
  if (!name || !admin_email) {
    return res.status(400).json({ error: 'name and admin_email are required' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO organisations (name, admin_email) VALUES (?, ?)',
      [name, admin_email]
    );
    res.json({ organisation_id: result.insertId, name, admin_email });
  } catch (err) {
    console.error('POST /organisations/create:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Accounts / Users ──────────────────────────────────────────────────────────

// POST /createAccount  (invite a user — creates account with temporary hash)
app.post('/createAccount', async (req, res) => {
  const email        = req.body.email        || req.body.get?.('email');
  const role         = req.body.role         || req.body.get?.('role')         || 'Member';
  const organisation = req.body.organisation || req.body.get?.('organisation') || null;

  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    const [existing] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, organisation_id) VALUES (?, ?, ?, ?, ?)',
      [email, email, 'PENDING', role, organisation || null]
    );
    res.json({ user_id: result.insertId, email, role });
  } catch (err) {
    console.error('POST /createAccount:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { email, passHash } = req.body;
  if (!email || !passHash) {
    return res.status(400).json({ error: 'email and passHash are required' });
  }
  try {
    const [rows] = await pool.execute(
      'SELECT user_id, password_hash FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0 || rows[0].password_hash !== passHash) {
      return res.json({ confirm: false });
    }
    res.json({ confirm: true, id: rows[0].user_id });
  } catch (err) {
    console.error('POST /login:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /:userID  — fetch user profile
app.get('/:userID(\\d+)', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT user_id, name, email, role, organisation_id FROM users WHERE user_id = ?',
      [req.params.userID]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /:userID:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Secrets ───────────────────────────────────────────────────────────────────

// POST /data/submit
app.post('/data/submit', async (req, res) => {
  const userID         = req.body.userID         || req.body.get?.('userID');
  const name           = req.body.name           || req.body.get?.('name');
  const submissionData = req.body.submissionData || req.body.get?.('submissionData');
  const iv             = req.body.iv             || req.body.get?.('iv');

  if (!userID || !name || !submissionData || !iv) {
    return res.status(400).json({ error: 'userID, name, submissionData and iv are required' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO secrets (user_id, name, submission_data, iv) VALUES (?, ?, ?, ?)',
      [userID, name, submissionData, iv]
    );
    res.json({ secret_id: result.insertId });
  } catch (err) {
    console.error('POST /data/submit:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /data/:userID — fetch all secrets for a user
app.get('/data/:userID', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT secret_id, name, submission_data, iv, vault_id, created_at FROM secrets WHERE user_id = ?',
      [req.params.userID]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /data/:userID:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /data/vault/:vaultID — fetch secrets by vault
app.get('/data/vault/:vaultID', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT secret_id, name, submission_data, iv, user_id, created_at FROM secrets WHERE vault_id = ?',
      [req.params.vaultID]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /data/vault/:vaultID:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Audit Logs ────────────────────────────────────────────────────────────────

// POST /audit/log
app.post('/audit/log', async (req, res) => {
  const {
    organisation_id, user_id, user_role, action_type,
    target_type, target_id, target_name, action_status,
    failure_reason, user_agent, session_id, details_json,
    hash_prev, hash_current,
  } = req.body;

  if (!action_type) return res.status(400).json({ error: 'action_type is required' });

  try {
    const [result] = await pool.execute(
      `INSERT INTO audit_logs
        (organisation_id, user_id, user_role, action_type, target_type, target_id,
         target_name, action_status, failure_reason, ip_address, user_agent,
         session_id, details_json, hash_prev, hash_current)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        organisation_id ?? 0,
        user_id         ?? 0,
        user_role       ?? 'Member',
        action_type,
        target_type     ?? null,
        target_id       ?? null,
        target_name     ?? null,
        action_status   ?? 'SUCCESS',
        failure_reason  ?? null,
        clientIp(req),
        user_agent      ?? null,
        session_id      ?? null,
        details_json    ? JSON.stringify(details_json) : null,
        hash_prev       ?? null,
        hash_current    ?? null,
      ]
    );
    res.json({ audit_id: result.insertId });
  } catch (err) {
    console.error('POST /audit/log:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /audit/logs
app.get('/audit/logs', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM audit_logs ORDER BY event_timestamp DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /audit/logs:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /audit/logs
app.delete('/audit/logs', async (req, res) => {
  try {
    await pool.execute('DELETE FROM audit_logs');
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /audit/logs:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`VaultWeb API  →  http://localhost:${PORT}`);
});
