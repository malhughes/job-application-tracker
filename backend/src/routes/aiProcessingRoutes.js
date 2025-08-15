import { Router } from 'express';
import {
  extractJobDetails,
  generateResumeBullets,
  generateFollowupEmail,
} from '../controllers/aiProcessingController.js';

const router = Router();

// Handles paste/link/upload in one endpoint
router.post('/extract', extractJobDetails);
router.post('/resume-bullets', generateResumeBullets);
router.post('/followup-email', generateFollowupEmail);

export default router;
