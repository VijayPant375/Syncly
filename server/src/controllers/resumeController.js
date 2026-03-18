const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Delete old resume if exists
    const existing = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1',
      [req.user.id]
    );

    if (existing.rows.length > 0) {
      const oldFile = existing.rows[0].filepath;
      if (fs.existsSync(oldFile)) {
        fs.unlinkSync(oldFile);
      }
      await pool.query('DELETE FROM resumes WHERE user_id = $1', [req.user.id]);
    }

    // Save new resume
    const result = await pool.query(
      `INSERT INTO resumes (user_id, filename, filepath)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, req.file.originalname, req.file.path]
    );

    res.status(201).json({
      message: 'Resume uploaded successfully.',
      resume: result.rows[0],
    });
  } catch (err) {
    console.error('Upload resume error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getMyResume = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No resume found.' });
    }

    res.json({ resume: result.rows[0] });
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const deleteResume = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No resume found.' });
    }

    const filepath = result.rows[0].filepath;
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await pool.query('DELETE FROM resumes WHERE user_id = $1', [req.user.id]);

    res.json({ message: 'Resume deleted successfully.' });
  } catch (err) {
    console.error('Delete resume error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { uploadResume, getMyResume, deleteResume };