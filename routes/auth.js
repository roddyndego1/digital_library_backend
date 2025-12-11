const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');


const router = express.Router();


// Register (student)
router.post('/register', async (req, res) => {
const { full_name, email, password } = req.body;
if(!full_name || !email || !password) return res.status(400).json({ error: 'Missing fields' });


const hashed = await bcrypt.hash(password, 10);
const stmt = db.prepare('INSERT INTO users(full_name,email,password,user_type) VALUES(?,?,?,?)');
stmt.run(full_name, email, hashed, 'student', function(err) {
if(err) return res.status(400).json({ error: 'Email exists or invalid data' });
const user = { user_id: this.lastID, full_name, email, user_type: 'student' };
const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
res.json({ token, user });
});
});


// Login (student/admin)
router.post('/login', (req, res) => {
const { email, password } = req.body;
if(!email || !password) return res.status(400).json({ error: 'Missing fields' });


db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
if(err) return res.status(500).json({ error: 'DB error' });
if(!row) return res.status(400).json({ error: 'Invalid credentials' });


const ok = await bcrypt.compare(password, row.password);
if(!ok) return res.status(400).json({ error: 'Invalid credentials' });


const user = { user_id: row.user_id, full_name: row.full_name, email: row.email, user_type: row.user_type };
const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
res.json({ token, user });
});
});


module.exports = router;