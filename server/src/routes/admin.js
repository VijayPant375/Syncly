const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllApplications,
  deleteUser,
  getDashboardStats,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate, authorize('admin'));

// GET /api/admin/stats — dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/admin/users — get all users
router.get('/users', getAllUsers);

// DELETE /api/admin/users/:id — delete a user
router.delete('/users/:id', deleteUser);

// GET /api/admin/applications — get all applications
router.get('/applications', getAllApplications);

module.exports = router;