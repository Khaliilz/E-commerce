const express = require('express');
const { pool } = require('../db');
const { hash_salt_pepper, createToken } = require('../utils/crypto');

const router = express.Router();

router.post('/api/v1/users/auth', async (req, res) => {
    // handle both login and registration
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Email and password are required'
        });
    }

    try {
        // Check if user exists
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length > 0) {
            // Gestisco login
            const user = rows[0];
            if (user.password_hash === hash_salt_pepper(password, email)) {
                const token = createToken(user);

                res.setHeader('Authorization', `Bearer ${token}`);
                return res.status(200).json({
                    status: 'success',
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                });
            } else {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid password'
                });
            }
        } else {
            // User does not exist, handle registration
            const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hash_salt_pepper(password, email)]);
            
            res.setHeader('Authorization', `Bearer ${createToken(newUser.rows[0])}`);
            
            return res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                user: {
                    id: newUser.rows[0].id,
                    email: newUser.rows[0].email
                }
            });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.post('/api/v1/users/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'Email and new password are required'
        });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const user = rows[0];
        const hashedPassword = hash_salt_pepper(newPassword, email);

        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;