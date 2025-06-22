const express = require('express');
const { pool } = require('../db');
const { hash_salt_pepper, createToken } = require('../utils/crypto');
const { authed } = require('../middleware');

const router = express.Router();

router.post('/api/v1/users/login', async (req, res) => {

    const {email, password} = req.body;
    //console.log('Login request body:', req.body);
    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Email and password are required'
        });
    }

    try {
        // Check if user exists
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        //console.log('User query result:', rows);
        if(rows.length === 0)
            return res.status(401).json({
                status: 'error',
                message: 'User not found'
        });

        const user = rows[0];
        if (user.password_hash === hash_salt_pepper(password, email)) {
            const token = createToken(user);

            res.setHeader('Access-Control-Expose-Headers', 'Authorization');
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
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.post('/api/v1/users/signup', async (req, res) => {
    try{
        //console.log('Headers:', req.headers);
        const { fullname , email, password, role } = req.body;
        //console.log('Signup request body:', req.body);

        const banned = await pool.query('SELECT email FROM banned_emails WHERE email = $1',[email]);
        if (banned.rows.length > 0) {
            return res.status(403).json({
                status: 'error',
                message: 'This email is banned'
            });
        }
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(rows.length > 0)
            return res.status(401).json({
                status: 'error',
                message: 'User already exists'
        });

        const newUser = await pool.query('INSERT INTO users (fullname, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *', [fullname, email, hash_salt_pepper(password, email), role]);
            
        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', `Bearer ${createToken(newUser.rows[0])}`);
            
        return res.status(200).json({
            status: 'success',
            message: 'User registered successfully',
            user: {
                id: newUser.rows[0].id,
                fullname: newUser.rows[0].fullname,
                email: newUser.rows[0].email,
                role: newUser.rows[0].role
            }
        });
    }catch(error){
        console.error('Error during authentication:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.get('/api/v1/users/profile', authed, async (req, res) => {
    const userId = req.user.id;

    try {
        const { rows } = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user: rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/api/v1/users/all', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.status(200).json({
            status: 'success',
            data: {
                users: rows
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
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

        const hashedPassword = hash_salt_pepper(newPassword, email);

        if( hashedPassword === rows[0].password_hash) {
            return res.status(400).json({
                status: 'error',
                message: 'New password cannot be the same as the old password'
            });
        }

        await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, email]);

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