const { Client, Pool } = require('pg');
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = require('../config.js');
const fs = require('node:fs');
const { seedDatabase } = require('../../resources/initScript.js');

const config = {
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: +DB_PORT
};

const connectWithRetry = async (retries = 3, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = new Client(config);
      await client.connect();
      console.log(`Database connected successfully on attempt ${attempt}`);
      return client;
    } catch (err) {
      console.warn(`Attempt ${attempt} - Failed to connect to DB. Retrying in ${delay / 1000}s...`);
      if (attempt === retries) throw new Error('Max DB connection attempts exceeded');
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

const setupDb = async () => {
  let client;
  try {
    client = await connectWithRetry(); // restituisce un client già connesso

    const checkDbQuery = `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'`;
    const { rows } = await client.query(checkDbQuery);

    const tableCount = parseInt(rows[0].count);
    const isFirstRun = tableCount === 0;

    if (isFirstRun) {
      const sql = fs.readFileSync('resources/init-db.sql', 'utf8');
      await client.query(sql);
      console.log('Database initialized successfully');
    } else {
      console.log('Database already initialized');
    }

    await seedDatabase();
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    if (client) {
      await client.end();
      console.log('Database connection closed');
    }
    require('../utils/taskScheduler.js');
  }
};

module.exports = {
  setupDb,
  pool: new Pool(config)
};