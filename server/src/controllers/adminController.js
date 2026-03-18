const pool = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json({ users: result.rows });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, 
              u.name AS seeker_name, u.email AS seeker_email,
              j.title AS job_title, j.company
       FROM applications a
       JOIN users u ON a.seeker_id = u.id
       JOIN jobs j ON a.job_id = j.id
       ORDER BY a.created_at DESC`
    );

    res.json({ applications: result.rows });
  } catch (err) {
    console.error('Get all applications error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: `User ${result.rows[0].name} deleted successfully.` });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const users       = await pool.query('SELECT COUNT(*) FROM users');
    const jobs        = await pool.query('SELECT COUNT(*) FROM jobs');
    const applications = await pool.query('SELECT COUNT(*) FROM applications');
    const seekers     = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'seeker'");
    const employers   = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'employer'");

    res.json({
      stats: {
        totalUsers:        parseInt(users.rows[0].count),
        totalJobs:         parseInt(jobs.rows[0].count),
        totalApplications: parseInt(applications.rows[0].count),
        totalSeekers:      parseInt(seekers.rows[0].count),
        totalEmployers:    parseInt(employers.rows[0].count),
      },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getAllUsers, getAllApplications, deleteUser, getDashboardStats };