const pool = require('../config/db');

const applyToJob = async (req, res) => {
  const { job_id, cover_letter } = req.body;
  const seekerId = req.user.id;

  try {
    // Check job exists
    const job = await pool.query('SELECT id FROM jobs WHERE id = $1', [job_id]);
    if (job.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Check already applied
    const existing = await pool.query(
      'SELECT id FROM applications WHERE job_id = $1 AND seeker_id = $2',
      [job_id, seekerId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You have already applied to this job.' });
    }

    const result = await pool.query(
      `INSERT INTO applications (job_id, seeker_id, cover_letter)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [job_id, seekerId, cover_letter]
    );

    res.status(201).json({ application: result.rows[0] });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getMyApplications = async (req, res) => {
  const seekerId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT a.*, j.title, j.company, j.location, j.type, j.salary
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.seeker_id = $1
       ORDER BY a.created_at DESC`,
      [seekerId]
    );

    res.json({ applications: result.rows });
  } catch (err) {
    console.error('Get my applications error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getJobApplicants = async (req, res) => {
  const { jobId } = req.params;
  const employerId = req.user.id;

  try {
    // Verify the job belongs to this employer
    const job = await pool.query(
      'SELECT id FROM jobs WHERE id = $1 AND employer_id = $2',
      [jobId, employerId]
    );
    if (job.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or unauthorized.' });
    }

    const result = await pool.query(
      `SELECT a.*, u.name AS seeker_name, u.email AS seeker_email
       FROM applications a
       JOIN users u ON a.seeker_id = u.id
       WHERE a.job_id = $1
       ORDER BY a.created_at DESC`,
      [jobId]
    );

    res.json({ applicants: result.rows });
  } catch (err) {
    console.error('Get applicants error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const employerId = req.user.id;

  const allowedStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  try {
    // Make sure the application belongs to a job owned by this employer
    const result = await pool.query(
      `UPDATE applications a
       SET status = $1
       FROM jobs j
       WHERE a.job_id = j.id
         AND j.employer_id = $2
         AND a.id = $3
       RETURNING a.*`,
      [status, employerId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found or unauthorized.' });
    }

    res.json({ application: result.rows[0] });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};