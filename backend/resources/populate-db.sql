/* Mock data */
INSERT INTO users (fullname, email, password_hash, role) VALUES
('admin','admin@example.com', 'f3ad86f9661e6bb662908556a3d34be534175d9db922b801922e17cf27e3bb89', 'admin'),
('user','user@example.com', '872ccea818dd938facd03b3b7cd9fb080bb287421cc722232cf86a2c9af38113', 'user'),
('seller','seller@example.com', '46ed65a631d0a7742ba4372b2419f4fcee4003c7c4478a98bcb802b96bce551a', 'seller');

INSERT INTO categories (name) VALUES
('Giochi da tavolo'),  -- This will get ID 1
('Automobili'),        -- This will get ID 2
('Carte da gioco'),    -- This will get ID 3
('Bambole');           -- This will get ID 4

INSERT INTO products (seller_id, name, description, price, stock, image_path) VALUES
(3, 'Product 1', 'Description for product 1', 19.99, 100, '/uploads/makina.jpg'),  -- ID 1
(3, 'Product 2', 'Description for product 2', 29.99, 50, '/uploads/makina.jpg'),   -- ID 2
(3, 'Product 3', 'Description for product 3', 39.99, 25, '/uploads/makina.jpg');   -- ID 3

INSERT INTO product_categories (product_id, category_id) VALUES
(1, 1),  -- Product 1 is in Giochi da tavolo
(2, 2),  -- Product 2 is in Automobili
(3, 3);  -- Product 3 is in Carte da gioco

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