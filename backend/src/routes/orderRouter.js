const express = require('express');
const { authed } = require('../middleware/index.js');
const { pool } = require('../db');

const router = express.Router();

router.post('/api/v1/user/cart', authed, async (req, res) => {
    const { id: userId } = req.user;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({
            status: 'error',
            message: 'Product ID and quantity are required'
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows: productRows } = await client.query('SELECT * FROM products WHERE id = $1', [productId]);

        if (productRows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Controlla se il prodotto è già nel carrello dell'utente

        const { rows: cartRows } = await client.query(
            'SELECT * FROM cart_products WHERE cart_id = $1 AND product_id = $2',
            [userId, productId]
        );

        if(cartRows.length > 0) {
            // Se il prodotto è già nel carrello, aggiorna la quantità
            const existingProduct = cartRows[0];
            const newQuantity = existingProduct.quantity + quantity;

            if(newQuantity <= 0) {
                await client.query(
                    'DELETE FROM cart_products WHERE cart_id = $1 AND product_id = $2',
                    [userId, productId]
                );
            } else {
                await client.query(
                    'UPDATE cart_products SET quantity = $1 WHERE cart_id = $2 AND product_id = $3',
                    [newQuantity, userId, productId]
                );
            }

            await client.query(
                'UPDATE users SET last_cart_edit = NOW() WHERE id = $1',
                [userId]
            );

            return res.status(200).json({
                status: 'success',
                message: 'Product quantity updated in cart',
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

        await client.query(
            'INSERT INTO cart_products (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
            [userId, productId, quantity]
        );

        await client.query(
            'UPDATE users SET last_cart_edit = NOW() WHERE id = $1',
            [userId]
        );

        res.status(201).json({
            status: 'success',
            message: 'Product added to cart',
            data: {
                productId,
                quantity
            }
        });

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding product to cart:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    } finally {
     client.release();
    }
});

router.post('/api/v1/user/cart/checkout', authed, async (req, res) => {
    const { id: userId } = req.user;

    try {
        const { rows: cartRows } = await pool.query(
            'SELECT * FROM cart_products WHERE cart_id = $1',
            [userId]
        );

        if (cartRows.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'cart is empty'
            });
        }

        const totalPrice = cartRows.reduce((total, item) => {
            return total + (item.quantity * item.price);
        }, 0);

        const { rows: orderRows } = await pool.query(
            'INSERT INTO orders (user_id, total, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [userId, totalPrice]
        );

        const orderId = orderRows[0].id;

        for (const item of cartRows) {
            await pool.query(
                'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
                [orderId, item.product_id, item.quantity]
            );
        }

        await pool.query(
            'DELETE FROM cart_products WHERE cart_id = $1',
            [userId]
        );

        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: {
                orderId,
                products: cartRows
            }
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.get('/api/v1/user/cart', authed, async (req, res) => {
    const { id: userId } = req.user;

    if (!userId) {
        return res.status(400).json({
            status: 'error',
            message: 'userId is required'
        });
    }

    try {
        const { rows: cartRows } = await pool.query(`
            SELECT 
                kp.*,
                p.name,
                p.description,
                p.price,
                p.image_path,
                p.stock
            FROM cart_products kp
            JOIN products p ON kp.product_id = p.id
            WHERE kp.cart_id = $1`, [userId]);

        if (cartRows.length === 0) {
            return res.status(200).json({
                status: 'error',
                message: 'Cart is empty',
                data: {
                    products: []
                }
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Order created successfully',
            data: {
                products: cartRows
            }
        });
    }catch(error){
        console.error('Error during cart\'s products research:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.put('/api/v1/user/cart', authed, async (req, res) => {
    const { id: userId } = req.user;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({
            status: 'error',
            message: 'Product ID and quantity are required'
        });
    }

    try {
        // Validate quantity
        const quantityNum = Number(quantity);
        if (isNaN(quantityNum)) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity must be a number'
            });
        }

        // Check if product exists in user's cart
        const { rows: cartItems } = await pool.query(
            `SELECT kp.*, p.stock 
             FROM cart_products kp
             JOIN products p ON kp.product_id = p.id
             WHERE kp.cart_id = $1 AND kp.product_id = $2`,
            [userId, productId]
        );

        if (cartItems.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found in cart'
            });
        }

        // Check stock availability
        if (quantityNum > cartItems[0].stock) {
            return res.status(400).json({
                status: 'error',
                message: `Only ${cartItems[0].stock} items available in stock`
            });
        }

        // Update quantity
        await pool.query(
            'UPDATE cart_products SET quantity = $1 WHERE cart_id = $2 AND product_id = $3',
            [quantityNum, userId, productId]
        );

        res.status(200).json({
            status: 'success',
            message: 'Cart updated successfully',
            data: {
                productId,
                quantity: quantityNum
            }
        });

    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.delete('/api/v1/user/cart', authed, async (req, res) => {
    const { id: userId } = req.user;
    const { productId } = req.query;

    if (!productId) {
        return res.status(400).json({
            status: 'error',
            message: 'Product ID is required'
        });
    }

    try {
        const { rows: cartItems } = await pool.query('SELECT * FROM cart_products WHERE cart_id = $1 AND product_id = $2', [userId, productId]);

        if (cartItems.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found in cart'
            });
        }

        // Remove product from cart
        await pool.query(
            'DELETE FROM cart_products WHERE cart_id = $1 AND product_id = $2',
            [userId, productId]
        );

        res.status(200).json({
            status: 'success',
            message: 'Product removed from cart',
            data: {
                productId
            }
        });

    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;