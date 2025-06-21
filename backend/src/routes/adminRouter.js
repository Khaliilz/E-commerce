const express = require('express');
const { authed } = require('../middleware/index.js');
const { pool } = require('../db');

const router = express.Router();

router.post('/api/v1/admin/ban', authed, async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'Target user ID is required'
        });
    }

    try {
        await pool.query('INSERT INTO banned_emails (email) VALUES ($1)', [email]);
        await pool.query('DELETE FROM users WHERE email = $1', [email]);
        res.status(200).json({
            status: 'success',
            message: `User ${email} has been banned`
        });
    } catch (error) {
        console.error('Error banning user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});

router.post('/api/v1/admin/message', authed, async (req, res) => {
    const { id: userId } = req.user;

    const { target, message } = req.body;

    if (!target || !message) {
        return res.status(400).json({
            status: 'error',
            message: 'Target and message are required'
        });
    }

    try {
        if (target === 'all') {
            // Send message to all users
            await pool.query(
                'INSERT INTO messages_recipients (sender_id, recipient_id, content) SELECT $1, id, $2 FROM users',
                [userId, message]
            );
        } else {
            // Treat as user id
            await pool.query(
                'INSERT INTO messages_recipients (sender_id, recipient_id, content) VALUES ($1, $2, $3)',
                [userId, target, message]
            );
        }

        res.status(200).json({
            status: 'success',
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});



module.exports = router;