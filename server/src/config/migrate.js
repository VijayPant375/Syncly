require('dotenv').config();
const pool = require('./db');

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(150) UNIQUE NOT NULL,
        password   VARCHAR(255) NOT NULL,
        role       VARCHAR(20) NOT NULL DEFAULT 'seeker',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ users table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id           SERIAL PRIMARY KEY,
        employer_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title        VARCHAR(150) NOT NULL,
        company      VARCHAR(100) NOT NULL,
        location     VARCHAR(100),
        type         VARCHAR(50) DEFAULT 'full-time',
        description  TEXT,
        salary       VARCHAR(50),
        created_at   TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ jobs table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id         SERIAL PRIMARY KEY,
        job_id     INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        seeker_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status     VARCHAR(50) DEFAULT 'pending',
        cover_letter TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(job_id, seeker_id)
      );
    `);
    console.log('✓ applications table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
        filename   VARCHAR(255) NOT NULL,
        filepath   VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ resumes table ready');

    console.log('✓ All tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

createTables();