const express = require('express');
const { pool } = require('../db');
const { authed } = require('../middleware/index.js');
const uploadImage = require('../middleware/upload');
const fs = require('fs');
const router = express.Router();

router.post('/api/v1/products', authed, uploadImage, async (req, res) => {
    try {
        //console.log('Body:', req.body);
        //console.log('File:', req.file);

        const {
            productName: name,
            productDescription: description,
            productPrice: price,
            productStock: stock,
            productCategory: categoryId
        } = req.body;
        const sellerId = req.user.id;
        const image = req.file;

        if (!name || !description || !price || !stock || !image || !categoryId) {
            // Clean up uploaded files if validation fails
            if (image) {
                fs.unlinkSync(path.join(__dirname, '../public/uploads', image.filename));
            }
            return res.status(400).json({
                status: 'error',
                message: 'All fields including image are required'
            });
        }

        const imagePath = `/uploads/${image.filename}`;

        await pool.query('BEGIN');

        const { rows } = await pool.query(
            'INSERT INTO products (seller_id, name, description, price, stock, image_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [sellerId, name, description, price, stock, imagePath]
        );

        const productId = rows[0].id;

        await pool.query(
            `INSERT INTO product_categories (product_id, category_id)
             VALUES ($1, $2)`,
            [productId, categoryId]
        );

        await pool.query('COMMIT');

        res.status(201).json({
            status: 'success',
            data: {
                product: rows[0]
            }
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error adding product:', error);
        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

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

router.get('/api/v1/category/:categoryId/products', async (req, res) => {
    const {categoryId} = req.params;

    try {
        const { rows } = await pool.query(
            `SELECT p.*, c.name as category_name 
            FROM products p
            JOIN product_categories pc ON p.id = pc.product_id
            JOIN categories c ON pc.category_id = c.id
            WHERE pc.category_id = $1
            ORDER BY p.name`,
            [categoryId]
        );

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

router.get('/api/v1/categories', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM categories');
        res.status(200).json({
            status: 'success',
            data: {
                categories: rows
            }
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.post('/api/v1/newCategory', authed, async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            status: 'error',
            message: 'Category name is required'
        });
    }
    try {
        const { rows } = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json({
            status: 'success',
            data: {
                category: rows[0]
            }
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.get('/api/v1/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const { rows } = await pool.query(`
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE p.id = $1`, [productId]
        );

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

router.get('/api/v1/products/seller/:id', async (req, res) => {
    const sellerId = parseInt(req.params.id, 10);
    
    if (isNaN(sellerId)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid seller ID'
        });
    }
    
    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE seller_id = $1', [req.params.id]);
        // Prepend host if needed
        const products = rows.map(p => ({
            ...p,
            image_url: p.image_path ? `http://localhost:3000${p.image_path}` : null
        }));
        res.status(200).json({
            status: 'success',
            data: {
                products
            }
        });
    } catch (error) {
        console.error('Error fetching seller products:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;