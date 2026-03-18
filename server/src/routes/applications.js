const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationsController');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/applications — seeker applies to a job
router.post('/', authenticate, authorize('seeker'), applyToJob);

// GET /api/applications/mine — seeker sees their applications
router.get('/mine', authenticate, authorize('seeker'), getMyApplications);

// GET /api/applications/job/:jobId — employer sees applicants for a job
router.get('/job/:jobId', authenticate, authorize('employer', 'admin'), getJobApplicants);

// PUT /api/applications/:id/status — employer updates application status
router.put('/:id/status', authenticate, authorize('employer', 'admin'), updateApplicationStatus);

module.exports = router;