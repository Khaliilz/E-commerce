const jwt = require('jsonwebtoken');
const { JWT_SECRET, PEPPER } = require('../config');
const crypto = require('node:crypto');

const createToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, JWT_SECRET);
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

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