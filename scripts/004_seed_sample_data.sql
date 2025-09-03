-- Sample data for Digital Library Platform

-- Insert sample genres
INSERT INTO public.genres (name, description) VALUES
('Fiction', 'Imaginative and creative literature'),
('Non-Fiction', 'Factual and informative content'),
('Mystery', 'Suspenseful stories with puzzles to solve'),
('Romance', 'Stories focused on love and relationships'),
('Science Fiction', 'Futuristic and speculative fiction'),
('Fantasy', 'Magical and supernatural stories'),
('Biography', 'Life stories of real people'),
('Self-Help', 'Personal development and improvement'),
('History', 'Past events and historical accounts'),
('Children', 'Books designed for young readers')
ON CONFLICT (name) DO NOTHING;

-- Insert sample authors
INSERT INTO public.authors (name, bio) VALUES
('Jane Austen', 'English novelist known for her wit and social commentary'),
('George Orwell', 'British author famous for dystopian fiction'),
('Agatha Christie', 'British crime novelist, creator of Hercule Poirot'),
('J.K. Rowling', 'British author of the Harry Potter series'),
('Stephen King', 'American author of horror and supernatural fiction'),
('Maya Angelou', 'American poet and civil rights activist'),
('Neil Gaiman', 'British author of fantasy and horror fiction'),
('Michelle Obama', 'Former First Lady and bestselling author'),
('Yuval Noah Harari', 'Israeli historian and philosopher'),
('Dr. Seuss', 'American children''s author and illustrator');

-- Insert sample books
INSERT INTO public.books (title, description, author_id, genre_id, page_count, price, is_featured, is_trending) 
SELECT 
  title,
  description,
  (SELECT id FROM public.authors WHERE name = author_name),
  (SELECT id FROM public.genres WHERE name = genre_name),
  page_count,
  price,
  is_featured,
  is_trending
FROM (VALUES
  ('Pride and Prejudice', 'A romantic novel about Elizabeth Bennet and Mr. Darcy', 'Jane Austen', 'Romance', 432, 12.99, true, false),
  ('1984', 'A dystopian novel about totalitarian surveillance', 'George Orwell', 'Fiction', 328, 13.99, true, true),
  ('Murder on the Orient Express', 'A classic mystery featuring Hercule Poirot', 'Agatha Christie', 'Mystery', 256, 11.99, false, true),
  ('Harry Potter and the Philosopher''s Stone', 'The first book in the magical Harry Potter series', 'J.K. Rowling', 'Fantasy', 352, 14.99, true, false),
  ('The Shining', 'A horror novel about a haunted hotel', 'Stephen King', 'Fiction', 512, 15.99, false, false),
  ('I Know Why the Caged Bird Sings', 'An autobiographical work by Maya Angelou', 'Maya Angelou', 'Biography', 304, 13.99, false, false),
  ('American Gods', 'A fantasy novel about old and new gods in America', 'Neil Gaiman', 'Fantasy', 736, 16.99, false, true),
  ('Becoming', 'Michelle Obama''s inspiring memoir', 'Michelle Obama', 'Biography', 448, 17.99, true, true),
  ('Sapiens', 'A brief history of humankind', 'Yuval Noah Harari', 'History', 512, 18.99, true, false),
  ('The Cat in the Hat', 'A beloved children''s story', 'Dr. Seuss', 'Children', 64, 8.99, false, false)
) AS books_data(title, description, author_name, genre_name, page_count, price, is_featured, is_trending);

-- Insert sample book pages for the first book (Pride and Prejudice)
INSERT INTO public.book_pages (book_id, page_number, content)
SELECT 
  (SELECT id FROM public.books WHERE title = 'Pride and Prejudice'),
  page_num,
  content
FROM (VALUES
  (1, 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.'),
  (2, '"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?" Mr. Bennet replied that he had not. "But it is," returned she; "for Mrs. Long has just been here, and she told me all about it." Mr. Bennet made no answer.'),
  (3, '"Do you not want to know who has taken it?" cried his wife impatiently. "You want to tell me, and I have no objection to hearing it." This was invitation enough. "Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England..."')
) AS pages_data(page_num, content);

-- Insert sample book tags
INSERT INTO public.book_tags (book_id, tag_name, tag_type)
SELECT 
  b.id,
  tag_data.tag_name,
  tag_data.tag_type
FROM public.books b
CROSS JOIN (VALUES
  ('romantic', 'mood'),
  ('classic', 'theme'),
  ('adult', 'age_group'),
  ('literature', 'topic')
) AS tag_data(tag_name, tag_type)
WHERE b.title = 'Pride and Prejudice';

-- Insert more tags for other books
INSERT INTO public.book_tags (book_id, tag_name, tag_type)
SELECT 
  b.id,
  tag_data.tag_name,
  tag_data.tag_type
FROM public.books b
CROSS JOIN (VALUES
  ('dystopian', 'theme'),
  ('political', 'topic'),
  ('dark', 'mood'),
  ('adult', 'age_group')
) AS tag_data(tag_name, tag_type)
WHERE b.title = '1984';
