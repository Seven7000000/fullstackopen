-- Exercise 13.1: Create blogs table
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

-- Exercise 13.2: Insert sample data
INSERT INTO blogs (author, url, title, likes) VALUES
  ('Dan Abramov', 'https://overreacted.io/on-let-vs-const/', 'On let vs const', 5),
  ('Laurenz Albe', 'https://www.cybertec-postgresql.com/en/the-most-common-sql-mistakes/', 'Psql common mistakes', 0);

-- View all blogs
SELECT * FROM blogs;
