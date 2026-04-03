const express = require('express');
const router = express.Router();
const { uploadResume, getMyResume, deleteResume, getResumeText } = require('../controllers/resumeController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// POST /api/resume — upload resume
router.post('/', authenticate, upload.single('resume'), uploadResume);

// GET /api/resume — get my resume
router.get('/', authenticate, getMyResume);

// DELETE /api/resume — delete my resume
router.delete('/', authenticate, deleteResume);
// GET /api/resume/text — extract text from my resume
router.get('/text', authenticate, getResumeText);

module.exports = router;