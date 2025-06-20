const express = require('express');
const { authed } = require('../middleware/index.js');
const { pool } = require('../db');

const router = express.Router();

router.post('/api/v1/basket', authed, async (req, res) => {
    const { id: userId } = req.user;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({
            status: 'error',
            message: 'Product ID and quantity are required'
        });
    }

    // controlla se il prodotto esiste
    // se esiste, aggiungilo al carrello dell'utente e aggiorna last_basket_update
    // altrimenti 404
    // controlla se l'utente ha già nel carrello un prodotto con lo stesso ID e gestisci il caso.
    try {
        const { rows: productRows } = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

        if (productRows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Controlla se il prodotto è già nel carrello dell'utente

        const { rows: basketRows } = await pool.query(
            'SELECT * FROM basket_products WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        if(basketRows.length > 0) {
            // Se il prodotto è già nel carrello, aggiorna la quantità
            const existingProduct = basketRows[0];
            const newQuantity = existingProduct.quantity + quantity;

            if(newQuantity <= 0) {
                await pool.query(
                    'DELETE FROM basket_products WHERE user_id = $1 AND product_id = $2',
                    [userId, productId]
                );
            }

            await pool.query(
                'UPDATE basket SET quantity = $1',
                [newQuantity]
            );

            await pool.query(
                'UPDATE user SET last_basket_edit = NOW() WHERE id = $1',
                [userId]
            );

            return res.status(200).json({
                status: 'success',
                message: 'Product quantity updated in basket',
                data: {
                    productId,
                    quantity: newQuantity
                }
            });
        }

        // Se il prodotto non è nel carrello, aggiungilo

        if(quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity must be greater than zero'
            });
        }

        await pool.query(
            'INSERT INTO basket_products (user_id, product_id, quantity) VALUES ($1, $2, $3)',
            [userId, productId, quantity]
        );

        await pool.query(
            'UPDATE user SET last_basket_edit = NOW() WHERE id = $1',
            [userId]
        );

        res.status(201).json({
            status: 'success',
            message: 'Product added to basket',
            data: {
                productId,
                quantity
            }
        });
    } catch (error) {
        console.error('Error adding product to basket:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.post('/api/v1/basket/checkout', authed, async (req, res) => {
    // Memorizza tutti gli ID dei prodotti nel carrello dell'utente in un nuovo ordine aggiunto al db, poi svuota il carrello dell'utente.
    const { id: userId } = req.user;

    try {
        // Controlla se l'utente ha prodotti nel carrello
        const { rows: basketRows } = await pool.query(
            'SELECT * FROM basket_products WHERE user_id = $1',
            [userId]
        );

        if (basketRows.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Basket is empty'
            });
        }

        // get the total price of the products in the basket
        const totalPrice = basketRows.reduce((total, item) => {
            return total + (item.quantity * item.price);
        }, 0);

        // Crea un nuovo ordine
        const { rows: orderRows } = await pool.query(
            'INSERT INTO orders (user_id, total, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [userId, totalPrice]
        );

        const orderId = orderRows[0].id;

        // Aggiungi i prodotti dell'utente all'ordine
        for (const item of basketRows) {
            await pool.query(
                'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
                [orderId, item.product_id, item.quantity]
            );
        }

        // Svuota il carrello dell'utente
        await pool.query(
            'DELETE FROM basket_products WHERE user_id = $1',
            [userId]
        );

        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: {
                orderId,
                products: basketRows
            }
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
})

module.exports = router;