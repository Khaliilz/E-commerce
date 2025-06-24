/* Mock data */
INSERT INTO users (fullname, email, password_hash, description, role) VALUES
('admin','admin@example.com', 'f3ad86f9661e6bb662908556a3d34be534175d9db922b801922e17cf27e3bb89', NULL,'admin'),
('user','user@example.com', '872ccea818dd938facd03b3b7cd9fb080bb287421cc722232cf86a2c9af38113', NULL, 'user'),
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
(3, 'Macchinina veloce', 'Macchinina molto veloce ma veramente velce', 19.99, 10, '/uploads/automobile1.jpg'),  -- ID 1
(3, 'Brum brum', 'Non ci crederai mai ma questa macchinina è fatta a mano', 29.99, 5, '/uploads/automobile2.jpg'),   -- ID 2
(3, 'Francesco', 'Francesco è una macchina che non vede l ora di venir pilotata da te', 199.99, 1, '/uploads/automobile3.jpg'),   -- ID 3
(3, 'Automobile Giocattolo', 'Vendo automobile giocattolo per i bambini, mio figlio non la usa più', 9.99, 7, '/uploads/automobile4.jpg'),  -- ID 4 ...
(4, 'Statuina', 'Statuina di cera fatta a mano', 4.99, 20, '/uploads/bambole1.jpg'),
(4, 'Curioso come George bamboline', 'Bamboline della serie Curioso come George per far divertire i più piccolo!', 29.99, 50, '/uploads/bambole2.jpg'),
(4, 'Unicorno di pezza', 'Unicorno di pezza per tenere compagnia ai vostri piccoli!', 5, 3, '/uploads/bambole3.jpg'),
(4, 'Bambola di pezza', 'Pagliaccio di pezza per spaventare i vostri piccoletti!', 49.99, 8, '/uploads/bambole4.jpg'),
(5, 'Gioco di carte', 'Gioco di carte vintage', 19.99, 1, '/uploads/carteDaGioco1.jpg'),
(5, 'Carte da gioco fatte a mano', 'Carte di gioco fatte a mano da mia figlia', 29.99, 50, '/uploads/carteDaGioco2.jpg'),
(5, 'Carte da gioco fatte a mano', 'Carte di gioco fatte a mano da mia figlia', 39.99, 25, '/uploads/carteDaGioco3.jpg'),
(5, 'Carte da gioco fatte a mano', 'Carte di gioco fatte a mano da mia figlia', 19.99, 100, '/uploads/carteDaGioco4.jpg'),
(5, 'Carte da gioco fatte a mano', 'Carte di gioco fatte a mano da mia figlia', 29.99, 50, '/uploads/carteDaGioco5.jpg'),
(5, 'Carte da gioco fatte a mano', 'Carte di gioco fatte a mano da mia figlia', 39.99, 25, '/uploads/carteDaGioco6.jpg'),
(6, 'Gioco da tavolo innovativo fatto a mano', 'Bellissimo gioco ', 19.99, 100, '/uploads/giocoDaTavolo1.jpg'),
(6, 'Il lancio dei dadi', 'Gioco da me inventato molto carinetto, giuro', 29.99, 50, '/uploads/giocoDaTavolo2.jpg'),
(6, 'Tris', 'Gioco classico adatto a tutte le fascie d età', 39.99, 25, '/uploads/giocoDaTavolo3.jpg'),
(6, 'Forza quattro!', 'Gioco classico adatto a tutte le fascie d età', 19.99, 100, '/uploads/giocoDaTavolo4.jpg');

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
(1, 'Benvenuto sulla piattaforma!'),
(2, 'Domani ci sarà un interruzione del sistema'),
(3, 'Buon natale a tutti!');

INSERT INTO messages_recipients (message_id, recipient_id) VALUES
(1, 2),
(2, 1),
(3, 2);