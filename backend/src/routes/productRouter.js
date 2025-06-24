const express = require('express');
const { pool } = require('../db');
const { authed } = require('../middleware/index.js');
const uploadImage = require('../middleware/upload');
const fs = require('fs');
const router = express.Router();
const path = require('path');  

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
        if (req.file) fs.unlinkSync(req.file.path);


        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.get('/api/v1/products', async (req, res) => {
    //console.log('GET /api/v1/products hit');
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

router.get('/api/v1/product/:id/stocks', async (req, res) => {
     const productId = req.params.id;

    if (!productId || isNaN(productId)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid product ID'
        });
    }

    try {
        const { rows } = await pool.query(
            'SELECT id, stock FROM products WHERE id = $1',
            [productId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const product = rows[0];
        res.status(200).json({
            status: 'success',
            data: {
                stock: product.stock,
                product_id: product.id
            }
        });

    } catch (error) {
        console.error('Error fetching product stock:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

router.put('/api/v1/product/:id/stocks', async (req, res) => {
    const productId = req.params.id;
    const { adjustment } = req.body;

    if (!productId || isNaN(productId)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid product ID'
        });
    }

    if (adjustment === undefined || isNaN(adjustment)) {
        return res.status(400).json({
            status: 'error',
            message: 'Adjustment must be a number'
        });
    }

    try {
        const { rows } = await pool.query(
            'SELECT stock, seller_id FROM products WHERE id = $1',
            [productId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const currentStock = rows[0].stock;
        const newStock = currentStock + adjustment;

        if (newStock < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient stock available'
            });
        }

        await pool.query(
            'UPDATE products SET stock = $1 WHERE id = $2',
            [newStock, productId]
        );

        res.status(200).json({
            status: 'success',
            data: {
                id: productId,
                stock: newStock
            }
        });

    } catch (error) {
        console.error('Error updating product stock:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

router.put('/api/v1/products/seller/:id/stock', authed, async (req, res) => {
    const productId = req.params.id;
    const { stock } = req.body;

    try {
        if (!productId || isNaN(productId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid product ID'
            });
        }

        const { rows: productRows } = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [productId]
        );

        if (productRows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        if (isNaN(stock) || stock < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Stock must be a positive integer'
            });
        }

        const { rows: updatedRows } = await pool.query(
            `UPDATE products SET stock = $1 WHERE id = $2 RETURNING id, name, description, price, stock, image_path`,[stock,productId]
        );

        res.status(200).json({
            status: 'success',
            data: updatedRows[0]
        });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

router.get('/api/v1/products/:id', async (req, res) => {
    const productId = req.params.id;

    if (!productId || isNaN(productId)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid product ID'
        });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

module.exports = router;