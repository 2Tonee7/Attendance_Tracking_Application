import { Router } from 'express';
import authRoutes from './authRoutes.js';
import eventGroupRoutes from './eventGroupRoutes.js';
import eventRoutes from './eventRoutes.js';
import { getAllUsers } from '../controllers/authController.js';
import attendanceRoutes from './attendanceRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/event-groups', eventGroupRoutes);
router.use('/events', eventRoutes);
router.use('/attendance', attendanceRoutes);

export default router;


