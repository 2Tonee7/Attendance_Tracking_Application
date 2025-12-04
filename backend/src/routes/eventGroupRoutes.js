import { Router } from 'express';
import { 
  createEventGroup, 
  getAllEventGroups, 
  getEventGroupById, 
  updateEventGroup, 
  deleteEventGroup 
} from '../controllers/eventGroupController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.post('/', createEventGroup);

router.get('/', getAllEventGroups);

router.get('/:id', getEventGroupById);

router.put('/:id', updateEventGroup);

router.delete('/:id', deleteEventGroup);

export default router;

