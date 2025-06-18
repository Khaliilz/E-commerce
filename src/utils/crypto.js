const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const crypto = require('node:crypto');

/**
 * Creates a JWT token for a user.
 * @param {Object} user 
 * @returns {string} token
 */
const createToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

/** * Verifies a JWT token and returns the decoded payload.
 * @param {string} token 
 * @returns {Object|null} decoded payload or null if verification fails
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Hashes a password with a salt and a pepper.
 * @param {string} password 
 * @param {string} mail 
 * @returns 
 */
const hash_salt_pepper = (password, mail) => {
    return crypto.createHash('sha256')
        .update(password + mail + PEPPER)
        .digest('hex');
}

module.exports = {
    createToken,
    verifyToken,
    hash_salt_pepper
};