const pool = require('../config/db');

const saveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const seekerId = req.user.id;

    await pool.query(
      'INSERT INTO saved_jobs (seeker_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [seekerId, id]
    );

    res.json({ message: 'Job saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save job' });
  }
};

const unsaveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const seekerId = req.user.id;

    await pool.query(
      'DELETE FROM saved_jobs WHERE seeker_id = $1 AND job_id = $2',
      [seekerId, id]
    );

    res.json({ message: 'Job unsaved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unsave job' });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const seekerId = req.user.id;

    const result = await pool.query(
      `SELECT j.*, sj.created_at as saved_at
       FROM jobs j
       JOIN saved_jobs sj ON j.id = sj.job_id
       WHERE sj.seeker_id = $1
       ORDER BY sj.created_at DESC`,
      [seekerId]
    );

    res.json({ jobs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved jobs' });
  }
};

module.exports = { saveJob, unsaveJob, getSavedJobs };