const express = require('express');
const router = express.Router();
const { uploadResume, getMyResume, deleteResume, getResumeText, analyzeAts } = require('../controllers/resumeController');
const { authenticate } = require('../middleware/auth');
const { upload, validateFileMIME, handleUploadError } = require('../middleware/upload');

// POST /api/resume — upload resume (with MIME validation)
router.post('/', authenticate, upload.single('resume'), handleUploadError, validateFileMIME, uploadResume);

// GET /api/resume — get my resume
router.get('/', authenticate, getMyResume);

// DELETE /api/resume — delete my resume
router.delete('/', authenticate, deleteResume);

// GET /api/resume/text — extract text from my resume
router.get('/text', authenticate, getResumeText);

// POST /api/resume/analyze-ats — analyze provided or stored resume directly from PDF (with MIME validation)
router.post('/analyze-ats', authenticate, upload.single('resume'), handleUploadError, validateFileMIME, analyzeAts);

module.exports = router;