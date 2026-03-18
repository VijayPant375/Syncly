const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/usersController');
const { authenticate } = require('../middleware/auth');

// GET /api/users/profile — get my profile
router.get('/profile', authenticate, getProfile);

// PUT /api/users/profile — update my profile
router.put('/profile', authenticate, updateProfile);

module.exports = router;