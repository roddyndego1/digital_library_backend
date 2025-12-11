const express = require('express');
const { db } = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');


const router = express.Router();


// Add book (admin)
router.post('/', authMiddleware, adminOnly, (req, res) => {
const { title, author, isbn, category } = req.body;
if(!title || !author) return res.status(400).json({ error: 'Missing fields' });


const stmt = db.prepare('INSERT INTO books(title,author,isbn,category,status) VALUES(?,?,?,?,?)');
stmt.run(title, author, isbn || null, category || null, 'available', function(err) {
if(err) return res.status(400).json({ error: 'Could not add book' });
res.json({ book_id: this.lastID });
});
});


// Update book (admin)
router.put('/:id', authMiddleware, adminOnly, (req, res) => {
const id = req.params.id;
const { title, author, isbn, category, status } = req.body;
db.run(
'UPDATE books SET title=?,author=?,isbn=?,category=?,status=? WHERE book_id=?',
[title,author,isbn,category,status || 'available', id],
function(err) {
if(err) return res.status(400).json({ error: 'Update failed' });
res.json({ updated: this.changes });
}
);
});


// Delete book (admin)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
const id = req.params.id;
db.run('DELETE FROM books WHERE book_id = ?', [id], function(err){
if(err) return res.status(400).json({ error: 'Delete failed' });
res.json({ deleted: this.changes });
});
});


// List + search books (public)
router.get('/', (req, res) => {
const { q, category, status } = req.query;
let sql = 'SELECT * FROM books WHERE 1=1';
const params = [];


if(q){ sql += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)'; params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
if(category){ sql += ' AND category = ?'; params.push(category); }
if(status){ sql += ' AND status = ?'; params.push(status); }


db.all(sql, params, (err, rows) => {
if(err) return res.status(500).json({ error: 'DB error' });
res.json(rows);
});
});


module.exports = router;