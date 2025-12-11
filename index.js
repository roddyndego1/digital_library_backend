const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./config/db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() as time");
        res.json({
            success: true,
            message: "Database connected!",
            time: result.rows[0].time,
            server: "Render",
            status: "Live"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database error",
            error: error.message,
            server: "Render",
            status: "Error"
        });
    }
});

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const check = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (check.rows.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    const result = await pool.query(
      `INSERT INTO users (email, password, name, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING id, email, name, role`,
      [email, password, name]
    );

    res.json({
      message: "Registration successful",
      user: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password)
      return res.status(400).json({ message: "Incorrect password" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user.id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/books", async (req, res) => {
  try {
    const books = await pool.query("SELECT * FROM books ORDER BY id ASC");
    res.json(books.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post("/books", auth, adminOnly, async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      description,
      total_copies,
      available_copies
    } = req.body;

    const result = await pool.query(
      `INSERT INTO books 
       (title, author, isbn, category, description, total_copies, available_copies)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        title,
        author,
        isbn,
        category,
        description,
        total_copies,
        available_copies
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/books/:id", auth, adminOnly, async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      description,
      total_copies,
      available_copies
    } = req.body;

    const result = await pool.query(
      `UPDATE books
       SET title=$1, author=$2, isbn=$3, category=$4,
           description=$5, total_copies=$6, available_copies=$7
       WHERE id=$8
       RETURNING *`,
      [
        title,
        author,
        isbn,
        category,
        description,
        total_copies,
        available_copies,
        req.params.id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/books/:id", auth, adminOnly, async (req, res) => {
  try {
    await pool.query("DELETE FROM books WHERE id=$1", [req.params.id]);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/borrow/:bookId", auth, async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const book = await pool.query("SELECT * FROM books WHERE id=$1", [bookId]);

    if (book.rows.length === 0)
      return res.status(404).json({ message: "Book not found" });

    if (book.rows[0].available_copies < 1)
      return res.status(400).json({ message: "No copies available" });

    const due = new Date();
    due.setDate(due.getDate() + 14);

    const borrow = await pool.query(
      `INSERT INTO borrow_records
       (user_id, book_id, borrow_date, due_date, status)
       VALUES ($1, $2, NOW(), $3, 'borrowed')
       RETURNING *`,
      [req.user.id, bookId, due]
    );

    await pool.query(
      "UPDATE books SET available_copies = available_copies - 1 WHERE id=$1",
      [bookId]
    );

    res.json(borrow.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/return/:bookId", auth, async (req, res) => {
  try {
    await pool.query(
      `UPDATE borrow_records
       SET return_date = NOW(), status='returned'
       WHERE user_id=$1 AND book_id=$2 AND status='borrowed'`,
      [req.user.id, req.params.bookId]
    );

    await pool.query(
      "UPDATE books SET available_copies = available_copies + 1 WHERE id=$1",
      [req.params.bookId]
    );

    res.json({ message: "Book returned successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/my-borrows", auth, async (req, res) => {
  try {
    const history = await pool.query(
      `SELECT * FROM borrow_records
       WHERE user_id=$1
       ORDER BY borrow_date DESC`,
      [req.user.id]
    );

    res.json(history.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/", (req, res) => {
  res.send("Digital Library Backend is Running Successfully");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);