const express = require('express');
const { pool } = require('../db');
const { authed } = require('../middleware/index.js');
const req = require('express/lib/request.js');
const router = express.Router();

router.get('/api/v1/products', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
        res.status(200).json({
            status: 'success',
            data: {
                products: rows
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.get('/api/v1/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                product: rows[0]
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.get('/api/v1/products/search', async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({
            status: 'error',
            message: 'Name query parameter is required'
        });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE name ILIKE $1', [`%${name}%`]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No products found matching the search criteria'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                products: rows
            }
        });

    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.post('/api/v1/products', authed, async (req, res) => {
    if (!req.user || req.user.role !== 'seller') {
        return res.status(403).json({
            status: 'error',
            message: 'Forbidden: Only sellers can add products'
        });
    }

    const { name, description, price, stock, image } = req.body;

    if (!name || !description || !price || !stock || !image) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required'
        });
    }

    const query = 'INSERT INTO products (name, seller_id, description, price, stock, image_base64) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [name, req.user.id, description, price, stock, image];

    try {
        const { rows } = await pool.query(query, values);
        res.status(201).json({
            status: 'success',
            data: {
                product: rows[0]
            }
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;