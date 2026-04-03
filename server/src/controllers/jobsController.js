const pool = require('../config/db');

const getAllJobs = async (req, res) => {
  const { search, location, type, min_salary, max_salary, remote } = req.query;

  try {
    let query = `
      SELECT j.*, u.name AS employer_name
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (j.title ILIKE $${paramCount} OR j.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (remote === 'true') {
      query += ` AND j.location ILIKE $${paramCount}`;
      params.push('%Remote%');
      paramCount++;
    } else if (location) {
      query += ` AND j.location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (type) {
      query += ` AND j.type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (min_salary && String(min_salary).trim() !== '' && !isNaN(min_salary)) {
      query += ` AND NULLIF(regexp_replace(substring(j.salary::text FROM '[0-9]+[0-9,.]*'), '[^0-9.]', '', 'g'), '')::numeric >= $${paramCount}`;
      params.push(parseFloat(min_salary));
      paramCount++;
    }

    if (max_salary && String(max_salary).trim() !== '' && !isNaN(max_salary)) {
      query += ` AND NULLIF(regexp_replace(substring(j.salary::text FROM '[0-9]+[0-9,.]*'), '[^0-9.]', '', 'g'), '')::numeric <= $${paramCount}`;
      params.push(parseFloat(max_salary));
      paramCount++;
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ jobs: result.rows });
  } catch (err) {
    console.error('Get all jobs error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT j.*, u.name AS employer_name
       FROM jobs j
       JOIN users u ON j.employer_id = u.id
       WHERE j.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    res.json({ job: result.rows[0] });
  } catch (err) {
    console.error('Get job error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const createJob = async (req, res) => {
  const { title, company, location, type, description, salary } = req.body;
  const employerId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO jobs (employer_id, title, company, location, type, description, salary)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [employerId, title, company, location, type, description, salary]
    );

    res.status(201).json({ job: result.rows[0] });
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, company, location, type, description, salary } = req.body;
  const employerId = req.user.id;

  try {
    const existing = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND employer_id = $2',
      [id, employerId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or unauthorized.' });
    }

    const result = await pool.query(
      `UPDATE jobs
       SET title=$1, company=$2, location=$3, type=$4, description=$5, salary=$6
       WHERE id=$7 AND employer_id=$8
       RETURNING *`,
      [title, company, location, type, description, salary, id, employerId]
    );

    res.json({ job: result.rows[0] });
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const employerId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 AND employer_id = $2 RETURNING id',
      [id, employerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or unauthorized.' });
    }

    res.json({ message: 'Job deleted successfully.' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };