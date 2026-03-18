const express = require('express');
const router = express.Router();
const { uploadResume, getMyResume, deleteResume } = require('../controllers/resumeController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// POST /api/resume — upload resume
router.post('/', authenticate, upload.single('resume'), uploadResume);

// GET /api/resume — get my resume
router.get('/', authenticate, getMyResume);

// DELETE /api/resume — delete my resume
router.delete('/', authenticate, deleteResume);

module.exports = router;