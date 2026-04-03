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
       'Tech Corp is seeking a Frontend Developer to create exceptional user experiences. Responsibilities include building scalable React components, translating UI/UX wireframes into responsive code, and optimizing applications for maximum speed. Requirements: 3+ years of React.js experience, proficiency in Tailwind CSS and TypeScript, strong understanding of RESTful API integration, and version control (Git). Bonus points for experience with Next.js or state management tools like Redux.', '$80,000 - $100,000'],

      [e1, 'Backend Engineer', 'Tech Corp', 'New York, NY', 'full-time',
       'Looking for a seasoned Node.js developer with robust PostgreSQL experience. As a Backend Engineer, you will design and maintain highly scalable APIs, manage complex database schemas, write efficient SQL queries, and deploy cloud functions using AWS. Requirements: 4+ years of backend development, strong knowledge of Express.js, experience with Docker/Kubernetes setups, and an understanding of OAuth/JWT security patterns. Ability to mentor junior developers is highly desired.', '$90,000 - $120,000'],

      [e1, 'DevOps Engineer', 'Tech Corp', 'Remote', 'full-time',
       'Seeking an experienced DevOps engineer to manage our cloud infrastructure on AWS. You will be responsible for creating, monitoring, and scaling our CI/CD pipelines using GitHub Actions, managing Docker containers via Kubernetes, and ensuring 99.9% uptime for core services. Requirements: Strong Python/Bash scripting, 3+ years working strictly in AWS environments (EC2, S3, RDS), and TerraForm/CloudFormation infrastructure-as-code expertise.', '$100,000 - $130,000'],

      [e2, 'UI/UX Designer', 'Nova Systems', 'Remote', 'part-time',
       'Creative designer needed for our product team. You will design intuitive user interfaces in Figma, create interactive prototypes, conduct extensive user research, and run A/B testing campaigns to improve platform metrics. Requirements: 2+ years of UI/UX experience, a strong portfolio demonstrating SaaS web app design, proficiency in Figma/Sketch, and basic HTML/CSS knowledge to collaborate smoothly with developers.', '$50,000 - $70,000'],

      [e2, 'Full Stack Developer', 'Nova Systems', 'Austin, TX', 'full-time',
       'Join our growing team as a Full Stack Developer. You will work across the entire stack using React, Node.js, and PostgreSQL to build and maintain our SaaS platform. You will be responsible for defining backend models, creating API endpoints, and connecting them to robust React frontends. Requirements: 3+ years experience with modern JavaScript frameworks, strong problem-solving skills, and a track record of delivering end-to-end features independently.', '$95,000 - $115,000'],

      [e2, 'Data Analyst', 'Nova Systems', 'Chicago, IL', 'full-time',
       'We are hiring a Data Analyst to help us make sense of our growing data. You will extract and manipulate data sets using SQL, write analytical scripts in Python (Pandas/NumPy), and build dashboards in Tableau/Looker. Requirements: Bachelor’s degree in a quantitative field, 2+ years of data analytics experience, strong statistical background, and excellent communication skills to present findings to leadership.', '$70,000 - $90,000'],

      [e2, 'Product Manager', 'Nova Systems', 'Remote', 'full-time',
       'Experienced Product Manager needed to lead our core product roadmap. You will work closely with engineering, design, and stakeholders to define and ship great products. Responsibilities include gathering user requirements, writing PRDs, managing Jira sprints, and analyzing KPIs. Requirements: 5+ years of software product management, Agile/Scrum master certification, and exceptional cross-functional leadership skills.', '$110,000 - $140,000'],

      [e3, 'Mobile Developer', 'Pixel Studio', 'San Francisco, CA', 'full-time',
       'Pixel Studio is looking for a React Native developer to build our mobile apps for iOS and Android. You will convert existing web interfaces into native-feeling mobile solutions using Expo. Requirements: 2+ years of React Native experience, understanding of mobile UI patterns, experience with app store deployments (App Store Connect / Google Play Console), and ability to write native iOS/Android bridge code if necessary.', '$85,000 - $110,000'],

      [e3, 'Graphic Designer', 'Pixel Studio', 'Remote', 'part-time',
       'We need a talented Graphic Designer to create visual assets for our clients. You will design social media graphics, email newsletter templates, website hero banners, and print materials. Requirements: 3+ years of graphic design experience, supreme proficiency in Adobe Creative Cloud (Illustrator, Photoshop, InDesign), and a keen eye for modern typography and color theory. Outstanding portfolio required.', '$40,000 - $60,000'],

      [e3, 'QA Engineer', 'Pixel Studio', 'Remote', 'contract',
       'Quality Assurance Engineer needed to ensure our products meet the highest standards. You will write comprehensive test plans, execute manual testing on staged releases, and develop automated end-to-end testing suites using Cypress or Selenium. Requirements: 2+ years of QA testing experience, strong analytical skills to identify edge cases, and familiarity with CI pipeline integrations.', '$60,000 - $80,000'],

      [e3, 'Marketing Specialist', 'Pixel Studio', 'Los Angeles, CA', 'full-time',
       'Join Pixel Studio as a Marketing Specialist. You will manage our social media presence, run paid ad campaigns (Google Ads / Facebook Ads), create engaging content, and analyze performance metrics via Google Analytics to maximize ROI. Requirements: 2+ years of digital marketing experience, strong copywriting skills, SEO knowledge, and proven success in audience growth.', '$55,000 - $75,000'],
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