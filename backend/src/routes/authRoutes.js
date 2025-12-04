import { Router } from 'express';
import { register, login, profile, getAllUsers } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.get('/profile', auth, profile);

router.get('/users', getAllUsers);

export default router;


