const { Client, Pool } = require('pg');
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = require('../config');
const fs = require('node:fs');

const config = {
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: +DB_PORT
};

const setupDb = async () => {
    const client = new Client(config);

    try {
        await client.connect();
        console.log('Database connected successfully');

        // check if the db is already initialized by checking for the existence of a table
        const checkDbQuery = 'SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = \'public\' AND tablename = \'users\')';
        const { rows } = await client.query(checkDbQuery);
        if (rows[0].exists) {
            console.log('Database already initialized');
            return;
        }

        const sql = fs.readFileSync('resources/init-db.sql', 'utf8');

        await client.query(sql);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        await client.end();
        console.log('Database connection closed');

        require('../utils/taskScheduler.js');
    }
}

module.exports = {
    setupDb,
    pool: new Pool(config)
}