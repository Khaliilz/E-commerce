const express = require('express');
const cors = require('cors');
const { exampleRouter } = require('./routes');
const { APP_PORT } = require('./config');
const { setupDb } = require('./db');

/**
 * @param {import('express').Express} app
 * @param {Function} cb
 */
const createApp = async (app, cb) => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })

    await promise;


    await setupDb();

    app.use(express.json());
    app.use(cors());
    app.use(express.static('public'));

    app.use(exampleRouter);

    app.listen(APP_PORT || 3000, cb);
}

module.exports = { createApp };