const express = require('express');
const cors = require('cors');
const { orderRouter, productRouter, userRouter, adminRouter } = require('./routes');
const { APP_PORT } = require('./config');
const { setupDb } = require('./db');
const path = require('path');


const createApp = async (app, cb) => {
    await setupDb();
    
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:3100',
        credentials: true
    }));
    
    app.use(express.static('../frontend/public'));

    // Register routes
    app.use(orderRouter);
    app.use(productRouter);
    app.use(userRouter);
    app.use(adminRouter);

    app.listen(APP_PORT || 3000, cb);
};

module.exports = { createApp };