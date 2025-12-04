import { EventGroup, Event } from '../models/index.js';
import { isOrganizer, isOwnerOrAdmin } from '../utils/auth.js';

export const createEventGroup = async (req, res) => {
  try {
    if (!isOrganizer(req.user)) {
      return res.status(403).json({ message: 'Only organizers can create event groups.' });
    }

    const { title, description, recurrence_type, start_date, end_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (recurrence_type && recurrence_type !== 'none') {
      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Start date and end date are required for recurring events.' });
      }
      if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({ message: 'Start date must be before end date.' });
      }
    }

    const eventGroup = await EventGroup.create({
      title,
      description,
      recurrence_type: recurrence_type || 'none',
      start_date: start_date || null,
      end_date: end_date || null,
      organizer_id: req.user.id
    });

    return res.status(201).json({ 
      message: 'Event group created successfully.', 
      eventGroup 
    });
  } catch (err) {
    console.error('Create event group error:', err);
    return res.status(500).json({ message: 'Error creating event group.' });
  }
};

export const getAllEventGroups = async (req, res) => {
  try {
    let whereClause = {};
    
    if (req.user.role !== 'admin') {
      whereClause.organizer_id = req.user.id;
    }

    const eventGroups = await EventGroup.findAll({
      where: whereClause,
      include: [
        {
          model: Event,
          as: 'events',
          attributes: ['id', 'title', 'status', 'start_time', 'end_time']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ eventGroups });
  } catch (err) {
    console.error('Get all event groups error:', err);
    return res.status(500).json({ message: 'Error fetching event groups.' });
  }
};

export const getEventGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const eventGroup = await EventGroup.findByPk(id, {
      include: [
        {
          model: Event,
          as: 'events',
          attributes: ['id', 'title', 'description', 'status', 'start_time', 'end_time', 'createdAt']
        }
      ]
    });

    if (!eventGroup) {
      return res.status(404).json({ message: 'Event group not found.' });
    }

    if (req.user.role !== 'admin' && eventGroup.organizer_id !== req.user.id) {
    }

    return res.json({ eventGroup });
  } catch (err) {
    console.error('Get event group by ID error:', err);
    return res.status(500).json({ message: 'Error fetching event group.' });
  }
};

export const updateEventGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, recurrence_type, start_date, end_date } = req.body;

    const eventGroup = await EventGroup.findByPk(id);

    if (!eventGroup) {
      return res.status(404).json({ message: 'Event group not found.' });
    }

    if (!isOwnerOrAdmin(req.user, eventGroup.organizer_id)) {
      return res.status(403).json({ message: 'You can only update your own event groups.' });
    }

    if (recurrence_type && recurrence_type !== 'none') {
      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Start date and end date are required for recurring events.' });
      }
      if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({ message: 'Start date must be before end date.' });
      }
    }

    await eventGroup.update({
      title: title || eventGroup.title,
      description: description !== undefined ? description : eventGroup.description,
      recurrence_type: recurrence_type || eventGroup.recurrence_type,
      start_date: start_date || eventGroup.start_date,
      end_date: end_date || eventGroup.end_date
    });

    return res.json({ 
      message: 'Event group updated successfully.', 
      eventGroup 
    });
  } catch (err) {
    console.error('Update event group error:', err);
    return res.status(500).json({ message: 'Error updating event group.' });
  }
};

export const deleteEventGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const eventGroup = await EventGroup.findByPk(id, {
      include: [{ model: Event, as: 'events' }]
    });

    if (!eventGroup) {
      return res.status(404).json({ message: 'Event group not found.' });
    }

    if (!isOwnerOrAdmin(req.user, eventGroup.organizer_id)) {
      return res.status(403).json({ message: 'You can only delete your own event groups.' });
    }

    await eventGroup.destroy();

    return res.json({ message: 'Event group deleted successfully.' });
  } catch (err) {
    console.error('Delete event group error:', err);
    return res.status(500).json({ message: 'Error deleting event group.' });
  }
};

