require('dotenv/config');
const express = require('express');
const { createApp } = require('./app');

const app = express();

createApp(app, () => {
    console.log(`Server is running on http://localhost:${process.env.APP_PORT || 3000}`);
});