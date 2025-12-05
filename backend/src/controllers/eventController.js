import { Event, EventGroup, AccessCode, User } from '../models/index.js';
import { isOwnerOrAdmin } from '../utils/auth.js';
import { Op } from 'sequelize';

const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createEvent = async (req, res) => {
  try {
    const { group_id, title, start_time, end_time } = req.body;
    const eventGroup = await EventGroup.findByPk(group_id);
    
    if (!eventGroup || !isOwnerOrAdmin(req.user, eventGroup.organizer_id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const event = await Event.create({ group_id, title, start_time, end_time });
    const code = await AccessCode.create({ event_id: event.id, code: generateCode() });
    
    return res.status(201).json({ event: { ...event.toJSON(), accessCode: code } });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating event.' });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { '$group.organizer_id$': req.user.id };
    const events = await Event.findAll({
      where,
      include: [
        { model: EventGroup, as: 'group', attributes: ['id', 'title'] },
        { model: AccessCode, as: 'accessCode', attributes: ['code'] }
      ]
    });
    return res.json({ events });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching events.' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: EventGroup, as: 'group' },
        { model: AccessCode, as: 'accessCode' },
        { model: User, as: 'participants', through: { attributes: ['checked_in_at'] } }
      ]
    });
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    return res.json({ event });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching event.' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, { include: [{ model: EventGroup, as: 'group' }] });
    if (!event || !isOwnerOrAdmin(req.user, event.group.organizer_id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    await event.update(req.body);
    return res.json({ event });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating event.' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, { include: [{ model: EventGroup, as: 'group' }] });
    if (!event || !isOwnerOrAdmin(req.user, event.group.organizer_id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    await event.destroy();
    return res.json({ message: 'Event deleted.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting event.' });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, { include: [{ model: EventGroup, as: 'group' }] });
    if (!event || !isOwnerOrAdmin(req.user, event.group.organizer_id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    await event.update({ status: req.body.status });
    return res.json({ event });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating status.' });
  }
};

export const updateAllEventStatuses = async (req, res) => {
  try {
    const now = new Date();
    await Event.update({ status: 'OPEN' }, {
      where: { status: 'CLOSED', start_time: { [Op.lte]: now }, end_time: { [Op.gt]: now } }
    });
    await Event.update({ status: 'CLOSED' }, {
      where: { status: 'OPEN', end_time: { [Op.lte]: now } }
    });
    return res.json({ message: 'Statuses updated.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating statuses.' });
  }
};

