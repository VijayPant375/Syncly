const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobsController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/jobs — public
router.get('/', getAllJobs);

// GET /api/jobs/:id — public
router.get('/:id', getJobById);

// POST /api/jobs — employers only
router.post('/', authenticate, authorize('employer', 'admin'), createJob);

// PUT /api/jobs/:id — employers only
router.put('/:id', authenticate, authorize('employer', 'admin'), updateJob);

// DELETE /api/jobs/:id — employers only
router.delete('/:id', authenticate, authorize('employer', 'admin'), deleteJob);

module.exports = router;