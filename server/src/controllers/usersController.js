const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const updateProfile = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required.' });
    }

    const result = await pool.query(
      `UPDATE users SET name = $1 WHERE id = $2
       RETURNING id, name, email, role, created_at`,
      [name.trim(), req.user.id]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getProfile, updateProfile };