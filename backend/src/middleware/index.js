const { verifyToken } = require('../utils/crypto.js');

const authed = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        // Verifica il token JWT
        //console.log('Authorization header:', authHeader);
        //console.log('Received token:', token);
        const decoded = verifyToken(token);
        //console.log('Decoded user:', decoded);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Aggiungi le informazioni dell'utente decodificate alla richiesta
        req.user = decoded;

        // Passa al middleware successivo
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = {
    authed
}