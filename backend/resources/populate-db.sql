/* Mock data */
INSERT INTO users (fullname, email, password_hash, role) VALUES
('Giovanni','admin@example.com', 'admin_password_hash', 'admin'),
('Alberto','user@example.com', 'user_password_hash', 'user'),
('Pietrellico','seller@example.com', 'seller_password_hash', 'seller');

INSERT INTO products (seller_id, name, description, price, stock, image_base64) VALUES
(3, 'Product 1', 'Description for product 1', 19.99, 100, 'base64_image_1'),
(3, 'Product 2', 'Description for product 2', 29.99, 50, 'base64_image_2'),
(3, 'Product 3', 'Description for product 3', 39.99, 25, 'base64_image_3');

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