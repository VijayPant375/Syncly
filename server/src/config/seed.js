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

    const employer1 = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Tech Corp', 'employer@syncly.com', hashedPassword, 'employer']
    );

    const employer2 = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Nova Systems', 'nova@syncly.com', hashedPassword, 'employer']
    );

    const employer3 = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Pixel Studio', 'pixel@syncly.com', hashedPassword, 'employer']
    );

    const seeker = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['John Doe', 'seeker@syncly.com', hashedPassword, 'seeker']
    );

    console.log('✓ Users seeded');

    const e1 = employer1.rows[0].id;
    const e2 = employer2.rows[0].id;
    const e3 = employer3.rows[0].id;

    const jobs = [
      [e1, 'Frontend Developer', 'Tech Corp', 'Remote', 'full-time',
       'We are looking for a skilled React developer to join our team. You will build modern web applications using React, Tailwind CSS, and REST APIs. Strong understanding of component architecture and state management required.', '$80,000 - $100,000'],

      [e1, 'Backend Engineer', 'Tech Corp', 'New York, NY', 'full-time',
       'Looking for a Node.js developer with PostgreSQL experience. You will design and maintain scalable APIs, manage database schemas, and collaborate with frontend teams to deliver high-quality products.', '$90,000 - $120,000'],

      [e1, 'DevOps Engineer', 'Tech Corp', 'Remote', 'full-time',
       'Seeking an experienced DevOps engineer to manage our cloud infrastructure on AWS. Experience with Docker, Kubernetes, and CI/CD pipelines is required.', '$100,000 - $130,000'],

      [e2, 'UI/UX Designer', 'Nova Systems', 'Remote', 'part-time',
       'Creative designer needed for our product team. You will design intuitive user interfaces, create wireframes and prototypes, and conduct user research to improve our platform.', '$50,000 - $70,000'],

      [e2, 'Full Stack Developer', 'Nova Systems', 'Austin, TX', 'full-time',
       'Join our growing team as a Full Stack Developer. You will work across the entire stack using React, Node.js, and PostgreSQL to build and maintain our SaaS platform.', '$95,000 - $115,000'],

      [e2, 'Data Analyst', 'Nova Systems', 'Chicago, IL', 'full-time',
       'We are hiring a Data Analyst to help us make sense of our growing data. You will work with SQL, Python, and visualization tools to generate insights and support business decisions.', '$70,000 - $90,000'],

      [e2, 'Product Manager', 'Nova Systems', 'Remote', 'full-time',
       'Experienced Product Manager needed to lead our core product roadmap. You will work closely with engineering, design, and stakeholders to define and ship great products.', '$110,000 - $140,000'],

      [e3, 'Mobile Developer', 'Pixel Studio', 'San Francisco, CA', 'full-time',
       'Pixel Studio is looking for a React Native developer to build our mobile apps for iOS and Android. Experience with Expo and mobile UI patterns is a plus.', '$85,000 - $110,000'],

      [e3, 'Graphic Designer', 'Pixel Studio', 'Remote', 'part-time',
       'We need a talented Graphic Designer to create visual assets for our clients. Proficiency in Figma, Adobe Illustrator, and Photoshop required.', '$40,000 - $60,000'],

      [e3, 'QA Engineer', 'Pixel Studio', 'Remote', 'contract',
       'Quality Assurance Engineer needed to ensure our products meet the highest standards. You will write test cases, perform manual and automated testing, and report bugs.', '$60,000 - $80,000'],

      [e3, 'Marketing Specialist', 'Pixel Studio', 'Los Angeles, CA', 'full-time',
       'Join Pixel Studio as a Marketing Specialist. You will manage social media, run campaigns, create content, and analyze performance metrics to grow our brand.', '$55,000 - $75,000'],
    ];

    for (const job of jobs) {
      await pool.query(
        `INSERT INTO jobs (employer_id, title, company, location, type, description, salary)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        job
      );
    }

    console.log('✓ Jobs seeded (11 jobs across 3 employers)');
    console.log('✓ Database seeded successfully');
    console.log('');
    console.log('Test accounts:');
    console.log('  admin@syncly.com    / password123');
    console.log('  employer@syncly.com / password123');
    console.log('  nova@syncly.com     / password123');
    console.log('  pixel@syncly.com    / password123');
    console.log('  seeker@syncly.com   / password123');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();