require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

const seed = async () => {
  try {
    // Clear existing data
    await pool.query('DELETE FROM applications');
    await pool.query('DELETE FROM resumes');
    await pool.query('DELETE FROM jobs');
    await pool.query('DELETE FROM users');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Admin User', 'admin@syncly.com', hashedPassword, 'admin']
    );

    const employer = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Tech Corp', 'employer@syncly.com', hashedPassword, 'employer']
    );

    const seeker = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['John Doe', 'seeker@syncly.com', hashedPassword, 'seeker']
    );

    console.log('✓ Users seeded');

    // Create sample jobs
    const employerId = employer.rows[0].id;

    await pool.query(
      `INSERT INTO jobs (employer_id, title, company, location, type, description, salary)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [employerId, 'Frontend Developer', 'Tech Corp', 'Remote', 'full-time',
       'We are looking for a skilled React developer to join our team.', '$80,000 - $100,000']
    );

    await pool.query(
      `INSERT INTO jobs (employer_id, title, company, location, type, description, salary)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [employerId, 'Backend Engineer', 'Tech Corp', 'New York', 'full-time',
       'Looking for a Node.js developer with PostgreSQL experience.', '$90,000 - $120,000']
    );

    await pool.query(
      `INSERT INTO jobs (employer_id, title, company, location, type, description, salary)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [employerId, 'UI/UX Designer', 'Tech Corp', 'Remote', 'part-time',
       'Creative designer needed for our product team.', '$50,000 - $70,000']
    );

    console.log('✓ Jobs seeded');
    console.log('✓ Database seeded successfully');
    console.log('');
    console.log('Test accounts:');
    console.log('  admin@syncly.com    / password123');
    console.log('  employer@syncly.com / password123');
    console.log('  seeker@syncly.com   / password123');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();