const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

// GET /api/profile
router.get('/', authenticate, getProfile);

// PUT /api/profile
router.put('/', authenticate, upsertProfile);

module.exports = router;