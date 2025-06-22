const express = require('express');
const cors = require('cors');
const { orderRouter, productRouter, userRouter, adminRouter } = require('./routes');
const { APP_PORT } = require('./config');
const { setupDb } = require('./db');
const path = require('path');
    const fs = require('fs');

const createApp = async (app, cb) => {
    await setupDb();
    
    const uploadPath = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    app.use('/uploads', express.static(uploadPath));

    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:3100',
        credentials: true
    }));

    app.use('/static', express.static(path.join(__dirname, '../frontend/public')));


    // Register routes
    app.use(orderRouter);
    app.use(productRouter);
    app.use(userRouter);
    app.use(adminRouter);

    app.listen(APP_PORT || 3000, cb);
};

module.exports = { createApp };