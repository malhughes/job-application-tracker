import { Router } from 'express';
import { extractJobDetails, generateFollowupEmail } from '../controllers/aiProcessingController.js';

const router = Router();

// Handles paste/link/upload in one endpoint
router.post('/extract', extractJobDetails);
// router.post('/resume-bullets', generateResumeBullets); (to be implemented later)
router.post('/followup-email/:id', generateFollowupEmail);

export default router;
