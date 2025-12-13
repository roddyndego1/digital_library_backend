-- Seed data for books table
-- Insert 20+ popular books with cover images

INSERT INTO books (title, author, isbn, category, description, image_url, total_copies, available_copies) VALUES
('1984', 'George Orwell', '978-0451524935', 'Dystopian Fiction', 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism. Winston Smith navigates a world of constant surveillance and thought control.', 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', 5, 5),

('To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'Classic Fiction', 'A gripping tale of racial injustice and childhood innocence in the American South. Scout Finch narrates her father Atticus''s defense of a Black man falsely accused of rape.', 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg', 4, 4),

('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'Classic Fiction', 'A tale of decadence and excess in Jazz Age New York. Jay Gatsby''s obsession with Daisy Buchanan leads to tragedy in this American classic.', 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg', 6, 6),

('Pride and Prejudice', 'Jane Austen', '978-0141439518', 'Romance', 'Elizabeth Bennet navigates love, class, and social expectations in Regency England. A timeless romance between Elizabeth and the proud Mr. Darcy.', 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg', 5, 5),

('The Catcher in the Rye', 'J.D. Salinger', '978-0316769174', 'Coming-of-Age Fiction', 'Holden Caulfield''s journey through New York City after being expelled from prep school. A powerful exploration of teenage alienation and rebellion.', 'https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg', 4, 4),

('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', '978-0747532699', 'Fantasy', 'The first book in the beloved Harry Potter series. Follow Harry as he discovers he''s a wizard and begins his magical education at Hogwarts School of Witchcraft and Wizardry.', 'https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg', 8, 8),

('The Lord of the Rings: The Fellowship of the Ring', 'J.R.R. Tolkien', '978-0547928210', 'Fantasy', 'The first volume of Tolkien''s epic fantasy trilogy. Frodo Baggins embarks on a perilous quest to destroy the One Ring and save Middle-earth from darkness.', 'https://covers.openlibrary.org/b/isbn/9780547928210-L.jpg', 6, 6),

('The Hobbit', 'J.R.R. Tolkien', '978-0547928227', 'Fantasy', 'Bilbo Baggins joins a company of dwarves on an unexpected journey to reclaim their homeland from the dragon Smaug. A prelude to The Lord of the Rings.', 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg', 5, 5),

('The Hunger Games', 'Suzanne Collins', '978-0439023528', 'Young Adult Dystopian', 'In a dystopian future, Katniss Everdeen volunteers to take her sister''s place in the Hunger Games, a televised fight to the death between teenagers.', 'https://covers.openlibrary.org/b/isbn/9780439023528-L.jpg', 7, 7),

('The Book Thief', 'Markus Zusak', '978-0375831003', 'Historical Fiction', 'Set in Nazi Germany, this novel follows Liesel Meminger, a young girl who steals books and shares them with others, including a Jewish man hiding in her basement.', 'https://covers.openlibrary.org/b/isbn/9780375831003-L.jpg', 4, 4),

('The Kite Runner', 'Khaled Hosseini', '978-1594631931', 'Literary Fiction', 'A powerful story of friendship, betrayal, and redemption set against the backdrop of Afghanistan''s tumultuous history from the 1970s to the early 2000s.', 'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg', 5, 5),

('The Alchemist', 'Paulo Coelho', '978-0061122415', 'Philosophical Fiction', 'A shepherd boy named Santiago travels from Spain to Egypt in search of a treasure, learning about following his dreams and listening to his heart along the way.', 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg', 6, 6),

('The Handmaid''s Tale', 'Margaret Atwood', '978-0385490818', 'Dystopian Fiction', 'In the Republic of Gilead, Offred is a Handmaid whose sole purpose is to bear children for the ruling class in this chilling dystopian vision of the future.', 'https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg', 4, 4),

('The Girl with the Dragon Tattoo', 'Stieg Larsson', '978-0307269751', 'Mystery Thriller', 'Journalist Mikael Blomkvist and hacker Lisbeth Salander investigate a decades-old disappearance in this gripping Scandinavian crime thriller.', 'https://covers.openlibrary.org/b/isbn/9780307269751-L.jpg', 5, 5),

('Gone Girl', 'Gillian Flynn', '978-0307588364', 'Psychological Thriller', 'On their fifth wedding anniversary, Nick Dunne''s wife Amy disappears. As the investigation unfolds, dark secrets about their marriage come to light.', 'https://covers.openlibrary.org/b/isbn/9780307588364-L.jpg', 6, 6),

('The Da Vinci Code', 'Dan Brown', '978-0307277671', 'Mystery Thriller', 'Harvard symbologist Robert Langdon uncovers a conspiracy involving the Catholic Church and a secret society in this fast-paced thriller.', 'https://covers.openlibrary.org/b/isbn/9780307277671-L.jpg', 7, 7),

('The Chronicles of Narnia: The Lion, the Witch and the Wardrobe', 'C.S. Lewis', '978-0064471046', 'Fantasy', 'Four siblings enter the magical world of Narnia through a wardrobe and join Aslan the lion in a battle against the White Witch.', 'https://covers.openlibrary.org/b/isbn/9780064471046-L.jpg', 5, 5),

('The Fault in Our Stars', 'John Green', '978-0525478812', 'Young Adult Romance', 'Hazel and Gus are two teenagers who meet in a cancer support group and fall in love in this heart-wrenching and beautiful story about life, death, and love.', 'https://covers.openlibrary.org/b/isbn/9780525478812-L.jpg', 6, 6),

('The Shining', 'Stephen King', '978-0307743657', 'Horror', 'Jack Torrance takes a job as the winter caretaker of the isolated Overlook Hotel, where supernatural forces drive him to madness and violence.', 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg', 4, 4),

('Dune', 'Frank Herbert', '978-0441013593', 'Science Fiction', 'On the desert planet Arrakis, Paul Atreides leads a rebellion against the evil Harkonnens in this epic science fiction masterpiece.', 'https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg', 5, 5),

('The Silent Patient', 'Alex Michaelides', '978-1250301697', 'Psychological Thriller', 'Alicia Berenson shoots her husband and then stops speaking. Psychotherapist Theo Faber is determined to understand why in this gripping psychological thriller.', 'https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg', 5, 5),

('Educated', 'Tara Westover', '978-0399590504', 'Memoir', 'A powerful memoir about a woman who grows up in a survivalist Mormon family in Idaho and eventually earns a PhD from Cambridge University.', 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg', 4, 4),

('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', '978-0062316097', 'Non-Fiction', 'An exploration of how Homo sapiens conquered the world through three major revolutions: cognitive, agricultural, and scientific.', 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg', 5, 5),

('The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', '978-1501139239', 'Historical Fiction', 'Reclusive Hollywood icon Evelyn Hugo finally decides to tell her life story to an unknown journalist, revealing secrets about her seven marriages and her rise to fame.', 'https://covers.openlibrary.org/b/isbn/9781501139239-L.jpg', 6, 6),

('Project Hail Mary', 'Andy Weir', '978-0593135204', 'Science Fiction', 'Ryland Grace wakes up alone on a spaceship with no memory of his mission. He must save humanity from an extinction-level threat in this thrilling space adventure.', 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg', 5, 5);
