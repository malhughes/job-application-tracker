import { Router } from 'express';
import {
  getApplications,
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationsController.js';
import auth from '../middleware/auth.js';

const router = Router();

// All application routes require authentication
router.use(auth);

router.get('/', getApplications);
router.post('/', createApplication);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
