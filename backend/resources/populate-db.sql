/* Mock data */
INSERT INTO users (fullname, email, password_hash, role) VALUES
('admin','admin@example.com', 'f3ad86f9661e6bb662908556a3d34be534175d9db922b801922e17cf27e3bb89', 'admin'),
('user','user@example.com', '872ccea818dd938facd03b3b7cd9fb080bb287421cc722232cf86a2c9af38113', 'user'),
('seller','seller@example.com', '46ed65a631d0a7742ba4372b2419f4fcee4003c7c4478a98bcb802b96bce551a', 'seller'),
('seller1','seller1@example.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJzZWxsZXIxQGV4YW1wbGUuY29tIiwicm9sZSI6InNlbGxlciIsImlhdCI6MTc1MDU5NDIzM30.g2BA1VDH-o3JSOLG0Hcg0EDJrGpVG1kji12wCLC8htY', 'seller'),
('seller2','seller2@example.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJzZWxsZXIyQGV4YW1wbGUuY29tIiwicm9sZSI6InNlbGxlciIsImlhdCI6MTc1MDU5NDI2MH0.Xn22c_guemBd2NtohcMlPm4gq-QVndoN72VJ75aHI_4', 'seller'),
('seller3','seller3@example.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJzZWxsZXIzQGV4YW1wbGUuY29tIiwicm9sZSI6InNlbGxlciIsImlhdCI6MTc1MDU5NDI4Nn0.p2SbXGS1dUSumgeiKps-w8mZbz0Smg4F79xALuDbkU0', 'seller');

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