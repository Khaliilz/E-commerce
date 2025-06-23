/* Mock data */
INSERT INTO users (fullname, email, password_hash, description, role) VALUES
('admin','admin@example.com', 'f3ad86f9661e6bb662908556a3d34be534175d9db922b801922e17cf27e3bb89', 'admin', NULL),
('user','user@example.com', '872ccea818dd938facd03b3b7cd9fb080bb287421cc722232cf86a2c9af38113', 'user', NULL),
('Mario Rossi','seller@example.com', '46ed65a631d0a7742ba4372b2419f4fcee4003c7c4478a98bcb802b96bce551a', 'ciao a tutti sono seller', 'seller'),
('Mario Bianchi','seller1@example.com', '49c3365571df7e2874ef76ee2cb78c737f4fe4d845d409f170b78aaafcb132b5', 'ciao a tutti sono seller1', 'seller'),
('Mario Neri','seller2@example.com', 'ee8220676c769fe9f62d8259e84923abef70c6e4fcfd38bbfaf6326570c306ab', 'ciao a tutti sono seller2', 'seller'),
('Mario Viola','seller3@example.com', '274d1355e8e5dfc9cc9a463f36a2595b57a5541b4d87cb5ef71da032eda36adb', 'ciao a tutti sono seller3', 'seller');

INSERT INTO categories (name) VALUES
('Giochi da tavolo'),  -- ID 1
('Automobili'),        -- ID 2
('Carte da gioco'),    -- ID 3
('Bambole');           -- ID 4

INSERT INTO products (seller_id, name, description, price, stock, image_path) VALUES
(1, 'automobile1', 'Description for product 1', 19.99, 100, '/uploads/automobile1.jpg'),  -- ID 1
(1, 'automobile2', 'Description for product 2', 29.99, 50, '/uploads/automobile2.jpg'),   -- ID 2
(1, 'automobile3', 'Description for product 3', 39.99, 25, '/uploads/automobile3.jpg'),   -- ID 3
(1, 'automobile4', 'Description for product 4', 19.99, 100, '/uploads/automobile4.jpg'),  -- ID 4 ...
(2, 'bambole1', 'Description for product 1', 19.99, 100, '/uploads/bambole1.jpg'),
(2, 'bambole2', 'Description for product 2', 29.99, 50, '/uploads/bambole2.jpg'),
(2, 'bambole3', 'Description for product 3', 39.99, 25, '/uploads/bambole3.jpg'),
(2, 'bambole4', 'Description for product 4', 19.99, 100, '/uploads/bambole4.jpg'),
(3, 'carteDaGioco1', 'Description for product 1', 19.99, 100, '/uploads/carteDaGioco1.jpg'),
(3, 'carteDaGioco2', 'Description for product 2', 29.99, 50, '/uploads/carteDaGioco2.jpg'),
(3, 'carteDaGioco3', 'Description for product 3', 39.99, 25, '/uploads/carteDaGioco3.jpg'),
(3, 'carteDaGioco4', 'Description for product 4', 19.99, 100, '/uploads/carteDaGioco4.jpg'),
(3, 'carteDaGioco5', 'Description for product 5', 29.99, 50, '/uploads/carteDaGioco5.jpg'),
(3, 'carteDaGioco6', 'Description for product 6', 39.99, 25, '/uploads/carteDaGioco6.jpg'),
(4, 'giocoDaTavolo1', 'Description for product 1', 19.99, 100, '/uploads/giocoDaTavolo1.jpg'),
(4, 'giocoDaTavolo2', 'Description for product 2', 29.99, 50, '/uploads/giocoDaTavolo2.jpg'),
(4, 'giocoDaTavolo3', 'Description for product 3', 39.99, 25, '/uploads/giocoDaTavolo3.jpg'),
(4, 'giocoDaTavolo4', 'Description for product 4', 19.99, 100, '/uploads/giocoDaTavolo4.jpg');

INSERT INTO product_categories (product_id, category_id) VALUES
(1, 2),  -- automobile1 is in Automobili
(2, 2),
(3, 2),
(4, 2),
(5, 4),  -- bambola1 is in Bambole
(6, 4),
(7, 4),
(8, 4),
(9, 3),  -- carteDaGioco1 is in Carte da gioco
(10, 3),
(11, 3),
(12, 3),
(13, 3),
(14, 3),
(15, 1), -- giocoDaTavolo1 is in Giochi da tavolo
(16, 1),
(17, 1),
(18, 1); 

INSERT INTO orders (user_id, total, status) VALUES
(2, 59.97, 'completed'),
(2, 29.99, 'pending');

INSERT INTO order_products (order_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 2, 1);

INSERT INTO messages (sender_id, content) VALUES
(1, 'Welcome to the platform!'),
(2, 'Hello, I have a question about my order.'),
(3, 'Thank you for your purchase!');

INSERT INTO messages_recipients (message_id, recipient_id) VALUES
(1, 2),
(2, 1),
(3, 2);