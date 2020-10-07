const { Pool } = require('pg');
const connectionString =
  process.env.DATABASE_URL || 'postgresql://localhost:5432/nypd';

const pool = new Pool({
  connectionString,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
