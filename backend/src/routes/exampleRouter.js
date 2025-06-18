const express = require('express');
const { pool } = require('../db');

// Questo è un ottimo metodo per gestire le rotte in un applicazione Express, permette di organizzare il codice in modo modulare e chiaro.
const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Simulazione di registrazione utente
    if (!username || !password) {
        res.status(400).json({ message: 'Dati di registrazione mancanti.' });
        return;
    }
})

module.exports = router;