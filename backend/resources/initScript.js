const fs = require('fs');
const path = require('path');

async function seedDatabase() {
  const sql = fs.readFileSync(path.join(__dirname, 'populate-db.sql')).toString();
  
  const { pool } = require('../src/db');

  try {
    await pool.query(sql);
    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

module.exports = { seedDatabase };
