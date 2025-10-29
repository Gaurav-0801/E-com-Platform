const { Pool } = require('pg');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.error('ERROR: DATABASE_URL is not set in environment variables');
  console.error('Please create a .env file in the backend directory with:');
  console.error('DATABASE_URL=your_connection_string_here');
  process.exit(1);
}

// Remove channel_binding parameter if present (not supported by all pg versions)
// Keep sslmode=require for SSL
connectionString = connectionString.replace(/[?&]channel_binding=[^&]*/g, '');

// NeonDB requires SSL connections
// Check if this is a NeonDB connection or if sslmode=require is in the connection string
const isNeonDB = connectionString.includes('neon.tech') || connectionString.includes('neondb');
const requiresSSL = connectionString.includes('sslmode=require');

const pool = new Pool({
  connectionString: connectionString,
  // Always enable SSL for NeonDB or when sslmode=require is specified
  ssl: (isNeonDB || requiresSSL) ? {
    rejectUnauthorized: false
  } : false
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
