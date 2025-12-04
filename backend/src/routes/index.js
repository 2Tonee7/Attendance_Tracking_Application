import { Router } from 'express';
import authRoutes from './authRoutes.js';
import eventGroupRoutes from './eventGroupRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/event-groups', eventGroupRoutes);

export default router;


