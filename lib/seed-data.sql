INSERT INTO todolists 
(title, username)
VALUES ('Work Todos', 'admin'), ('Home Todos', 'admin'), ('Additional Todos', 'admin'), ('Social Todos', 'admin');
-- Note: in the following statement, get the todo list IDs from
-- the todolists table. If the todo list IDs are 1, 2, 3, and 4, then our code
-- looks like this:
INSERT INTO todos
(title, done, todolist_id, username)
VALUES ('Get Coffee', true, 1, 'admin'), ('Chat with co-workers', true, 1, 'admin'), ('Duck out of meeting', false, 1, 'admin'),
('Feed the cats', true, 2, 'admin'), ('Go to bed', true, 2, 'admin'), ('Buy milk', true, 2, 'admin'), ('Study for Launch School', true, 2, 'admin'),
('Go to libby''s birthday party', false, 4, 'admin');