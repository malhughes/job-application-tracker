import { Router } from 'express';
import { extractJobDetails, generateFollowupEmail } from '../controllers/aiProcessingController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

//require auth for all ai processing routes
router.use(requireAuth);

// Handles paste/link/upload in one endpoint
router.post('/extract', extractJobDetails);
// router.post('/resume-bullets', generateResumeBullets); (to be implemented later)
router.post('/followup-email/:id', generateFollowupEmail);

export default router;
