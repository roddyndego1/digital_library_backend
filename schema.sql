-- Digital Library Backend Database Schema
-- PostgreSQL Database Tables

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS borrow_records CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50),
    category VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    total_copies INTEGER NOT NULL DEFAULT 0 CHECK (total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 0 CHECK (available_copies >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create borrow_records table
CREATE TABLE borrow_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    borrow_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    return_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_borrow_records_user_id ON borrow_records(user_id);
CREATE INDEX idx_borrow_records_book_id ON borrow_records(book_id);
CREATE INDEX idx_borrow_records_status ON borrow_records(status);

-- Add constraint to ensure available_copies doesn't exceed total_copies
ALTER TABLE books ADD CONSTRAINT check_available_copies 
    CHECK (available_copies <= total_copies);

-- Optional: Insert a default admin user (password should be hashed in production)
-- Uncomment and modify as needed:
-- INSERT INTO users (email, password, name, role) 
-- VALUES ('admin@library.com', 'admin123', 'Admin User', 'admin');
