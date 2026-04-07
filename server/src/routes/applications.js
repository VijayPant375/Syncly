const { validateApplication } = require('../middleware/applicationValidation');
const validate = require('../middleware/validate');
const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationsController');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/applications — seeker applies to a job
router.post('/', authenticate, authorize('seeker'), validateApplication, validate, applyToJob);

// GET /api/applications/mine — seeker sees their applications
router.get('/mine', authenticate, authorize('seeker'), getMyApplications);
router.delete('/:id', authenticate, authorize('seeker'), withdrawApplication);

// GET /api/applications/job/:jobId — employer sees applicants for a job
router.get('/job/:jobId', authenticate, authorize('employer', 'admin'), getJobApplicants);

// PUT /api/applications/:id/status — employer updates application status
router.put('/:id/status', authenticate, authorize('employer', 'admin'), updateApplicationStatus);

module.exports = router;
