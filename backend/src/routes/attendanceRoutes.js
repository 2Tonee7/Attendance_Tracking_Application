import { Router } from 'express';
import { checkIn, getEventAttendees } from '../controllers/attendanceController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);
router.post('/check-in', checkIn);
router.get('/events/:id/attendees', getEventAttendees);

export default router;

