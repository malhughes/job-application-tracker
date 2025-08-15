import { Router } from 'express';
import { login, register, logout, getMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);

export default router;
