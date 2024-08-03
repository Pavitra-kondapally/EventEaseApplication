// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const getWeather = require('./weather');
const { registerUser, loginUser, verifyToken } = require('./auth');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// User registration
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  registerUser(username, password, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  loginUser(username, password, (err, result) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(401).json({ error: err });
    }
    res.json(result);
  });
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  verifyToken(token, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ error: err });
    }
    req.user = user;
    next();
  });
};

// CRUD operations for events
app.post('/api/events', authenticateToken, async (req, res) => {
  const { name, location, date, description } = req.body;
  const weather = await getWeather(location);
  const stmt = db.prepare('INSERT INTO events (name, location, date, description, weather, userId) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(name, location, date, description, weather, req.user.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, location, date, description, weather });
  });
  stmt.finalize();
});

app.get('/api/events', authenticateToken, (req, res) => {
  db.all('SELECT * FROM events WHERE userId = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ events: rows });
  });
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  const { name, location, date, description } = req.body;
  const weather = await getWeather(location);
  const stmt = db.prepare('UPDATE events SET name = ?, location = ?, date = ?, description = ?, weather = ? WHERE id = ? AND userId = ?');
  stmt.run(name, location, date, description, weather, req.params.id, req.user.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
  stmt.finalize();
});

app.delete('/api/events/:id', authenticateToken, (req, res) => {
  const stmt = db.prepare('DELETE FROM events WHERE id = ? AND userId = ?');
  stmt.run(req.params.id, req.user.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
  stmt.finalize();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
