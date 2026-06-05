const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

app.use(cors(isProd ? {} : { origin: 'http://localhost:3000' }));
app.use(express.json());

/* ─── Storage: PostgreSQL in production, JSON file locally ─── */

let storage;

if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  storage = {
    async init() {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS requests (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          submitted_at TIMESTAMPTZ NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending_hr'
        )
      `);
    },
    async getAll() {
      const r = await pool.query('SELECT data FROM requests ORDER BY submitted_at DESC');
      return r.rows.map(row => row.data);
    },
    async get(id) {
      const r = await pool.query('SELECT data FROM requests WHERE id = $1', [id]);
      return r.rows[0]?.data || null;
    },
    async save(request) {
      await pool.query(
        `INSERT INTO requests (id, data, submitted_at, status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET data = $2, status = $4`,
        [request.id, request, request.submittedAt, request.status]
      );
    },
  };
} else {
  const DATA_FILE = path.join(__dirname, 'data', 'requests.json');

  storage = {
    async init() {},
    async getAll() {
      try {
        if (!fs.existsSync(DATA_FILE)) return [];
        const content = fs.readFileSync(DATA_FILE, 'utf-8').trim();
        const items = content ? JSON.parse(content) : [];
        return [...items].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      } catch { return []; }
    },
    async get(id) {
      const all = await this.getAll();
      return all.find(r => r.id === id) || null;
    },
    async save(request) {
      const all = await this.getAll();
      const index = all.findIndex(r => r.id === request.id);
      if (index === -1) all.push(request);
      else all[index] = request;
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2));
    },
  };
}

/* ─── Auth ─── */

function validateAuth(role, password) {
  const hrPass = process.env.HR_PASSWORD || 'hr123';
  const dirPass = process.env.DIRECTOR_PASSWORD || 'director123';
  if (role === 'hr' && password === hrPass) return true;
  if (role === 'director' && password === dirPass) return true;
  return false;
}

function requireAuth(req, res, next) {
  const role = req.headers['x-role'];
  const password = req.headers['x-password'];
  if (!validateAuth(role, password)) return res.status(401).json({ error: 'Unauthorized' });
  req.role = role;
  next();
}

/* ─── Routes ─── */

app.post('/api/auth/login', (req, res) => {
  const { role, password } = req.body;
  if (!role || !password) return res.status(400).json({ error: 'Role and password required' });
  if (validateAuth(role, password)) {
    res.json({ success: true, role });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/requests', async (req, res) => {
  const { employeeName, employeeEmail, department, toolType, toolName, toolWebsite, budgetAmount, budgetCycle, reason } = req.body;
  if (!employeeName || !employeeEmail || !department || !toolName || !budgetAmount || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const request = {
    id: uuidv4(),
    employeeName: employeeName.trim(),
    employeeEmail: employeeEmail.trim().toLowerCase(),
    department,
    toolType: toolType || 'ai',
    toolName: toolName.trim(),
    toolWebsite: toolWebsite?.trim() || '',
    budgetAmount: parseFloat(budgetAmount),
    budgetCycle: budgetCycle || 'monthly',
    reason: reason.trim(),
    status: 'pending_hr',
    submittedAt: new Date().toISOString(),
    hrAction: null,
    directorAction: null,
  };
  await storage.save(request);
  res.status(201).json({ success: true, request });
});

app.get('/api/requests', requireAuth, async (req, res) => {
  const requests = await storage.getAll();
  res.json(requests);
});

app.put('/api/requests/:id/approve', requireAuth, async (req, res) => {
  const request = await storage.get(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  if (req.role === 'hr' && request.status === 'pending_hr') {
    request.hrAction = { at: new Date().toISOString(), action: 'approved' };
    request.status = 'pending_director';
  } else if (req.role === 'director' && request.status === 'pending_director') {
    request.directorAction = { at: new Date().toISOString(), action: 'approved' };
    request.status = 'approved';
  } else {
    return res.status(400).json({ error: 'Cannot approve this request in its current state' });
  }

  await storage.save(request);
  res.json({ success: true, request });
});

app.put('/api/requests/:id/reject', requireAuth, async (req, res) => {
  const { reason } = req.body;
  const request = await storage.get(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  if (req.role === 'hr' && request.status === 'pending_hr') {
    request.hrAction = { at: new Date().toISOString(), action: 'rejected', reason: reason || '' };
    request.status = 'rejected';
    request.rejectedBy = 'hr';
  } else if (req.role === 'director' && request.status === 'pending_director') {
    request.directorAction = { at: new Date().toISOString(), action: 'rejected', reason: reason || '' };
    request.status = 'rejected';
    request.rejectedBy = 'director';
  } else {
    return res.status(400).json({ error: 'Cannot reject this request in its current state' });
  }

  await storage.save(request);
  res.json({ success: true, request });
});

/* ─── Serve frontend in production ─── */
if (isProd) {
  const distPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

/* ─── Start ─── */
const PORT = process.env.PORT || 3001;

storage.init()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => { console.error('Startup failed:', err); process.exit(1); });
