const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobsController');
const {
  saveJob,
  unsaveJob,
  getSavedJobs,
} = require('../controllers/savedJobsController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateJob } = require('../middleware/jobValidation');
const validate = require('../middleware/validate');

// GET /api/jobs — public
router.get('/', getAllJobs);

// Saved jobs — must be before /:id to avoid conflict
router.get('/saved/list', authenticate, authorize('seeker'), getSavedJobs);
router.post('/:id/save', authenticate, authorize('seeker'), saveJob);
router.delete('/:id/save', authenticate, authorize('seeker'), unsaveJob);

// GET /api/jobs/:id — public
router.get('/:id', getJobById);

// POST /api/jobs — employers only
router.post('/', authenticate, authorize('employer', 'admin'), validateJob, validate, createJob);

// PUT /api/jobs/:id — employers only
router.put('/:id', authenticate, authorize('employer', 'admin'), validateJob, validate, updateJob);

// DELETE /api/jobs/:id — employers only
router.delete('/:id', authenticate, authorize('employer', 'admin'), deleteJob);

module.exports = router;