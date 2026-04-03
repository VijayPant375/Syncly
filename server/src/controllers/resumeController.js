const pool = require('../config/db');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

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

const getResumeText = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No resume found.' });
    }

    const filepath = result.rows[0].filepath;
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Resume file missing from server.' });
    }

    const ext = path.extname(filepath).toLowerCase();
    let text = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filepath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (ext === '.docx') {
      const content = await mammoth.extractRawText({ path: filepath });
      text = content.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type for text extraction. Only PDF and DOCX are supported.' });
    }

    res.json({ text });
  } catch (err) {
    console.error('Extract resume text error:', err);
    res.status(500).json({ error: 'Failed to extract text from resume.' });
  }
};

const analyzeAts = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required.' });
    }

    const jobRes = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (jobRes.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    const job = jobRes.rows[0];

    let filepath;
    let isTempFile = false;

    if (req.file) {
      filepath = req.file.path;
      isTempFile = true;
    } else {
      const storedRes = await pool.query('SELECT * FROM resumes WHERE user_id = $1', [req.user.id]);
      if (storedRes.rows.length === 0) {
        return res.status(404).json({ error: 'No resume uploaded. Please upload a resume in your dashboard first.' });
      }
      filepath = storedRes.rows[0].filepath;
    }

    if (!fs.existsSync(filepath)) {
      if (isTempFile) fs.unlinkSync(filepath);
      return res.status(404).json({ error: 'Resume file missing from server.' });
    }

    const ext = path.extname(filepath).toLowerCase();
    let resumeText = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filepath);
      const data = await pdfParse(dataBuffer);
      resumeText = data.text;
    } else if (ext === '.docx') {
      const content = await mammoth.extractRawText({ path: filepath });
      resumeText = content.value;
    } else {
      if (isTempFile) fs.unlinkSync(filepath);
      return res.status(400).json({ error: 'Only PDF or DOCX resumes are supported.' });
    }

    if (isTempFile && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract readable text from your resume PDF. Please ensure it is not a scanned image.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing on server.' });
    }

    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume against the job description and provide:
1. An ATS compatibility score out of 100
2. A list of matching keywords found in both
3. A list of important missing keywords
4. 3-5 specific improvement suggestions

Resume:
${resumeText.substring(0, 6000)}

Job Description:
${job.description}

Respond in this exact JSON format with no extra text:
{
  "score": <number>,
  "matching_keywords": [<list of strings>],
  "missing_keywords": [<list of strings>],
  "suggestions": [<list of strings>]
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Gemini unexpected response:', JSON.stringify(geminiData));
      return res.status(500).json({ error: 'AI returned an unexpected response. Please try again.' });
    }

    const text = geminiData.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('ATS Analysis Error:', err);
    res.status(500).json({ error: 'Failed to analyze resume with AI.' });
  }
};

module.exports = { uploadResume, getMyResume, deleteResume, getResumeText, analyzeAts };