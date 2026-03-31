const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [userId]
    );
    res.json({ profile: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const upsertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, skills, linkedin, github, portfolio } = req.body;

    const result = await pool.query(
      `INSERT INTO profiles (user_id, bio, skills, linkedin, github, portfolio)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         bio = $2, skills = $3, linkedin = $4,
         github = $5, portfolio = $6, updated_at = NOW()
       RETURNING *`,
      [userId, bio, skills, linkedin, github, portfolio]
    );

    res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
};

module.exports = { getProfile, upsertProfile };