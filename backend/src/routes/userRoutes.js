import { Router } from 'express';
import { signIn, signUp, signOut, getMe, googleAuth } from '../controllers/userController.js';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/google', googleAuth);
router.get('/me', getMe);

export default router;
