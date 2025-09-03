-- Insert sample authors
INSERT INTO authors (name, bio) VALUES 
    ('Jane Austen', 'English novelist known for her wit and social commentary'),
    ('George Orwell', 'English novelist and essayist, journalist and critic'),
    ('J.K. Rowling', 'British author, best known for the Harry Potter series'),
    ('Agatha Christie', 'English writer known for her detective novels')
ON CONFLICT DO NOTHING;

-- Insert sample genres
INSERT INTO genres (name, description) VALUES 
    ('Fiction', 'Literary works of imaginative narration'),
    ('Mystery', 'Stories involving puzzles to be solved'),
    ('Fantasy', 'Stories set in imaginary worlds with magical elements'),
    ('Classic', 'Literature that has stood the test of time')
ON CONFLICT (name) DO NOTHING;

-- Insert sample books
INSERT INTO books (title, description, author_id, genre_id, page_count, price, is_featured, is_trending, is_new_release) 
SELECT 
    'Pride and Prejudice',
    'A romantic novel of manners written by Jane Austen in 1813.',
    a.id,
    g.id,
    432,
    9.99,
    true,
    false,
    false
FROM authors a, genres g 
WHERE a.name = 'Jane Austen' AND g.name = 'Classic'
ON CONFLICT DO NOTHING;

INSERT INTO books (title, description, author_id, genre_id, page_count, price, is_featured, is_trending, is_new_release) 
SELECT 
    '1984',
    'A dystopian social science fiction novel and cautionary tale.',
    a.id,
    g.id,
    328,
    12.99,
    true,
    true,
    false
FROM authors a, genres g 
WHERE a.name = 'George Orwell' AND g.name = 'Fiction'
ON CONFLICT DO NOTHING;

INSERT INTO books (title, description, author_id, genre_id, page_count, price, is_featured, is_trending, is_new_release) 
SELECT 
    'Harry Potter and the Philosopher''s Stone',
    'The first novel in the Harry Potter series.',
    a.id,
    g.id,
    223,
    14.99,
    false,
    true,
    true
FROM authors a, genres g 
WHERE a.name = 'J.K. Rowling' AND g.name = 'Fantasy'
ON CONFLICT DO NOTHING;

INSERT INTO books (title, description, author_id, genre_id, page_count, price, is_featured, is_trending, is_new_release) 
SELECT 
    'Murder on the Orient Express',
    'A detective novel featuring Hercule Poirot.',
    a.id,
    g.id,
    256,
    11.99,
    false,
    false,
    true
FROM authors a, genres g 
WHERE a.name = 'Agatha Christie' AND g.name = 'Mystery'
ON CONFLICT DO NOTHING;

INSERT INTO books (title, description, author_id, genre_id, page_count, price, is_featured, is_trending, is_new_release) 
SELECT 
    'Animal Farm',
    'An allegorical novella about farm animals who rebel against their human farmer.',
    a.id,
    g.id,
    112,
    8.99,
    true,
    false,
    false
FROM authors a, genres g 
WHERE a.name = 'George Orwell' AND g.name = 'Fiction'
ON CONFLICT DO NOTHING;