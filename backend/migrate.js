const path   = require('path');
const fs     = require('fs');
const mysql  = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  // Split on semicolons, strip comment lines from each chunk, drop empties
  const statements = schema
    .split(';')
    .map(s =>
      s.split('\n')
       .filter(line => !line.trim().startsWith('--'))
       .join('\n')
       .trim()
    )
    .filter(s => s.length > 0);

  // Connect without specifying a database so we can run CREATE DATABASE
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: false,
  });

  console.log('Connected to MySQL server');

  for (const stmt of statements) {
    // Show a short label for the log
    const label = stmt.replace(/\s+/g, ' ').slice(0, 72);
    try {
      await conn.query(stmt);
      console.log(`  ✓  ${label}`);
    } catch (err) {
      console.error(`  ✗  ${label}`);
      console.error(`     ${err.message}`);
      await conn.end();
      process.exit(1);
    }
  }

  await conn.end();
  console.log('\nMigration complete — all tables are ready.');
}

migrate();
