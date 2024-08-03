// auth.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
require('dotenv').config(); // Load environment variables

const secret = process.env.JWT_SECRET; // Use the JWT secret from environment variables

const registerUser = (username, password, callback) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return callback(err);
    if (user) return callback('User already exists');
    
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);
      const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      stmt.run(username, hashedPassword, function (err) {
        if (err) return callback(err);
        callback(null, { userId: this.lastID });
      });
      stmt.finalize();
    });
  });
};

const loginUser = (username, password, callback) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return callback('Invalid credentials');
    if (!user) return callback('Invalid credentials');
    
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return callback('Invalid credentials');
      if (!isMatch) return callback('Invalid credentials');
      
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
      
      // Save the session
      const stmt = db.prepare('INSERT INTO sessions (userId, token) VALUES (?, ?)');
      stmt.run(user.id, token, function (err) {
        if (err) return callback(err);
        callback(null, { token });
      });
      stmt.finalize();
    });
  });
};

const verifyToken = (token, callback) => {
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return callback('Invalid token');
    db.get('SELECT * FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err || !user) return callback('Invalid token');
      callback(null, user);
    });
  });
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
};
