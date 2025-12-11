const express = require('express');
// check availability
db.get('SELECT * FROM books WHERE book_id = ?', [bookId], (err, book) => {
if(err) return res.status(500).json({ error: 'DB error' });
if(!book) return res.status(404).json({ error: 'Book not found' });
if(book.status !== 'available') return res.status(400).json({ error: 'Book not available' });


const borrowDate = new Date().toISOString().split('T')[0];
const dueDateObj = new Date();
dueDateObj.setDate(dueDateObj.getDate() + 14);
const dueDate = dueDateObj.toISOString().split('T')[0];


const stmt = db.prepare('INSERT INTO borrowed_books(user_id,book_id,borrow_date,due_date) VALUES(?,?,?,?)');
stmt.run(userId, bookId, borrowDate, dueDate, function(err){
if(err) return res.status(500).json({ error: 'Could not register borrow' });
db.run('UPDATE books SET status = ? WHERE book_id = ?', ['borrowed', bookId]);
res.json({ borrow_id: this.lastID, borrow_date: borrowDate, due_date: dueDate });
});
});


// Return a book (student)
router.post('/return/:borrowId', authMiddleware, (req, res) => {
const userId = req.user.user_id;
const borrowId = req.params.borrowId;


db.get('SELECT * FROM borrowed_books WHERE borrow_id = ?', [borrowId], (err, row) => {
if(err) return res.status(500).json({ error: 'DB error' });
if(!row) return res.status(404).json({ error: 'Borrow record not found' });
if(row.user_id !== userId) return res.status(403).json({ error: 'Not your borrow record' });
if(row.return_date) return res.status(400).json({ error: 'Already returned' });


const returnDate = new Date().toISOString().split('T')[0];
db.run('UPDATE borrowed_books SET return_date = ? WHERE borrow_id = ?', [returnDate, borrowId], function(err){
if(err) return res.status(500).json({ error: 'Could not update return' });
db.run('UPDATE books SET status = ? WHERE book_id = ?', ['available', row.book_id]);
res.json({ returned: true, return_date: returnDate });
});
});
});


// Get my borrows
router.get('/my', authMiddleware, (req, res) => {
const userId = req.user.user_id;
db.all('SELECT bb.*, b.title, b.author FROM borrowed_books bb JOIN books b ON bb.book_id = b.book_id WHERE bb.user_id = ?', [userId], (err, rows) => {
if(err) return res.status(500).json({ error: 'DB error' });
res.json(rows);
});
});


module.exports = router;