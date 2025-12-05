import { Router } from 'express';
import { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent,
  updateEventStatus,
  updateAllEventStatuses
} from '../controllers/eventController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.post('/', createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

router.patch('/:id/status', updateEventStatus);
router.post('/update-statuses', updateAllEventStatuses);

export default router;

