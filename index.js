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
        const dbResult = await pool.query("SELECT NOW() as time");
        
        res.json({
            success: true,
            message: "Database connected successfully!",
            time: dbResult.rows[0].time,
            server: "Render",
            status: "Live"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to connect to database",
            error: error.message,
            server: "Render",
            status: "Error"
        });
    }
});


function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
  if (!secret || secret === 'default-secret-key-change-in-production') {
    console.warn('Warning: Using default JWT secret. Set JWT_SECRET in environment variables for production.');
  }
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    secret,
    { expiresIn: "7d" }
  );
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      message: "Authentication required. Please provide a valid token." 
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      message: "Authentication required. Please provide a valid token." 
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(403).json({ 
      message: "Invalid or expired token. Please login again." 
    });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      message: "Access denied. Admin privileges required." 
    });
  }
  next();
}

/**Account Creation*/
app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: "All fields are required: email, password, and name." 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address." 
      });
    }

    // Validate password length
    if (password.length < 3) {
      return res.status(400).json({ 
        message: "Password must be at least 3 characters long." 
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        message: "This email is already registered. Please use a different email or try logging in." 
      });
    }

    const newUser = await pool.query(
      `INSERT INTO users (email, password, name, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING id, email, name, role`,
      [email, password, name]
    );

    res.status(201).json({
      message: "Account created successfully! Welcome to the digital library.",
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: "Something went wrong during registration. Please try again.",
      error: error.message 
    });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required." 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address." 
      });
    }

    let userResult;
    try {
      userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({ 
        message: "Database error. Please try again later.",
        error: dbError.message 
      });
    }

    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password. Please check your credentials and try again." 
      });
    }

    if (user.password !== password) {
      return res.status(401).json({ 
        message: "Invalid email or password. Please check your credentials and try again." 
      });
    }

    try {
      const token = generateToken(user);

      res.json({
        message: "Login successful! Welcome back.",
        token,
        role: user.role,
        userId: user.id,
        name: user.name,
        email: user.email
      });
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      res.status(500).json({ 
        message: "Unable to generate authentication token. Please try again later.",
        error: tokenError.message 
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "Unable to process login request. Please try again later.",
      error: error.message 
    });
  }
});

//Fetch books
app.get("/books", async (req, res) => {
  try {
    const booksResult = await pool.query(
      "SELECT * FROM books ORDER BY id ASC"
    );
    
    res.json(booksResult.rows);
  } catch (error) {
    res.status(500).json({ 
      message: "Unable to retrieve books. Please try again later.",
      error: error.message 
    });
  }
});

//Fetch specific book with id

app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const bookResult = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ 
        message: "Sorry, we couldn't find a book with that ID." 
      });
    }

    res.json(bookResult.rows[0]);

  } catch (error) {
    res.status(500).json({ 
      message: "Unable to retrieve book information. Please try again later.",
      error: error.message 
    });
  }
});



//Add book to library(Admin only)
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

    const newBook = await pool.query(
      `INSERT INTO books 
       (title, author, isbn, category, description, total_copies, available_copies)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
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

    res.status(201).json({
      message: "Book added successfully to the library!",
      book: newBook.rows[0]
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Unable to add book. Please check all required fields and try again.",
      error: error.message 
    });
  }
});

//Update book(Admin only)

app.put("/books/:id", auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      isbn,
      category,
      description,
      total_copies,
      available_copies
    } = req.body;

    const existingBook = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );

    if (existingBook.rows.length === 0) {
      return res.status(404).json({ 
        message: "Book not found. Cannot update a book that doesn't exist." 
      });
    }

    const updatedBook = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, isbn = $3, category = $4,
           description = $5, total_copies = $6, available_copies = $7
       WHERE id = $8
       RETURNING *`,
      [
        title,
        author,
        isbn,
        category,
        description,
        total_copies,
        available_copies,
        id
      ]
    );

    res.json({
      message: "Book information updated successfully!",
      book: updatedBook.rows[0]
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Unable to update book. Please try again later.",
      error: error.message 
    });
  }
});

//Delete book(Admin only)
app.delete("/books/:id", auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book exists before deleting
    const existingBook = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );

    if (existingBook.rows.length === 0) {
      return res.status(404).json({ 
        message: "Book not found. Cannot delete a book that doesn't exist." 
      });
    }

    await pool.query("DELETE FROM books WHERE id = $1", [id]);
    
    res.json({ 
      message: "Book removed from the library successfully." 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Unable to delete book. Please try again later.",
      error: error.message 
    });
  }
});


// Borrow book
app.post("/borrow/:bookId", auth, async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user.id;

    // Check if book exists
    const bookResult = await pool.query(
      "SELECT * FROM books WHERE id = $1", 
      [bookId]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ 
        message: "Sorry, we couldn't find that book in our library." 
      });
    }

    const book = bookResult.rows[0];

    if (book.available_copies < 1) {
      return res.status(400).json({ 
        message: "Sorry, all copies of this book are currently checked out. Please try again later." 
      });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrowRecord = await pool.query(
      `INSERT INTO borrow_records
       (user_id, book_id, borrow_date, due_date, status)
       VALUES ($1, $2, NOW(), $3, 'borrowed')
       RETURNING *`,
      [userId, bookId, dueDate]
    );

    await pool.query(
      "UPDATE books SET available_copies = available_copies - 1 WHERE id = $1",
      [bookId]
    );

    res.status(201).json({
      message: "Book borrowed successfully! Please return it by the due date.",
      borrowRecord: borrowRecord.rows[0]
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Unable to process your borrow request. Please try again later.",
      error: error.message 
    });
  }
});

//Return book
app.post("/return/:bookId", auth, async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user.id;

    const activeBorrow = await pool.query(
      `SELECT * FROM borrow_records
       WHERE user_id = $1 AND book_id = $2 AND status = 'borrowed'`,
      [userId, bookId]
    );

    if (activeBorrow.rows.length === 0) {
      return res.status(404).json({ 
        message: "No active borrow record found for this book. It may have already been returned." 
      });
    }

    await pool.query(
      `UPDATE borrow_records
       SET return_date = NOW(), status = 'returned'
       WHERE user_id = $1 AND book_id = $2 AND status = 'borrowed'`,
      [userId, bookId]
    );

    await pool.query(
      "UPDATE books SET available_copies = available_copies + 1 WHERE id = $1",
      [bookId]
    );

    res.json({ 
      message: "Thank you for returning the book! We hope you enjoyed reading it." 
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Unable to process your return request. Please try again later.",
      error: error.message 
    });
  }
});

//Get borrow history of user
app.get("/my-borrows", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const borrowHistory = await pool.query(
      `SELECT br.*, b.title as book_title, b.author as book_author
       FROM borrow_records br
       JOIN books b ON br.book_id = b.id
       WHERE br.user_id = $1
       ORDER BY br.borrow_date DESC`,
      [userId]
    );

    // Return array format for frontend compatibility
    res.json(borrowHistory.rows);

  } catch (error) {
    res.status(500).json({ 
      message: "Unable to retrieve your borrowing history. Please try again later.",
      error: error.message 
    });
  }
});

// Admin: Get all borrow records
app.get("/admin/all-borrows", auth, adminOnly, async (req, res) => {
  try {
    const borrowHistory = await pool.query(
      `SELECT br.*, 
              b.title as book_title, 
              b.author as book_author,
              u.name as user_name,
              u.email as user_email
       FROM borrow_records br
       JOIN books b ON br.book_id = b.id
       JOIN users u ON br.user_id = u.id
       ORDER BY br.borrow_date DESC`
    );

    res.json(borrowHistory.rows);

  } catch (error) {
    res.status(500).json({ 
      message: "Unable to retrieve borrow records. Please try again later.",
      error: error.message 
    });
  }
});

// Admin: Get all users
app.get("/admin/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT id, email, name, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json(users.rows);

  } catch (error) {
    res.status(500).json({ 
      message: "Unable to retrieve users. Please try again later.",
      error: error.message 
    });
  }
});

// Return book by borrow record ID (for frontend compatibility)
app.post("/return-borrow/:borrowId", auth, async (req, res) => {
  try {
    const borrowId = req.params.borrowId;
    const userId = req.user.id;

    const activeBorrow = await pool.query(
      `SELECT * FROM borrow_records
       WHERE id = $1 AND user_id = $2 AND status = 'borrowed'`,
      [borrowId, userId]
    );

    if (activeBorrow.rows.length === 0) {
      return res.status(404).json({ 
        message: "No active borrow record found. It may have already been returned." 
      });
    }

    const bookId = activeBorrow.rows[0].book_id;

    await pool.query(
      `UPDATE borrow_records
       SET return_date = NOW(), status = 'returned'
       WHERE id = $1 AND status = 'borrowed'`,
      [borrowId]
    );

    await pool.query(
      "UPDATE books SET available_copies = available_copies + 1 WHERE id = $1",
      [bookId]
    );

    res.json({ 
      message: "Thank you for returning the book! We hope you enjoyed reading it." 
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Unable to process your return request. Please try again later.",
      error: error.message 
    });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`iBooks server is running on port ${PORT}`);
});