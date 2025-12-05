import { Attendance, Event, User, AccessCode } from '../models/index.js';

export const checkIn = async (req, res) => {
  try {
    const { code } = req.body;
    const accessCode = await AccessCode.findOne({ 
      where: { code, is_active: true },
      include: [{ model: Event, where: { status: 'OPEN' } }]
    });

    if (!accessCode) {
      return res.status(404).json({ message: 'Invalid or expired code.' });
    }

    const existing = await Attendance.findOne({
      where: { user_id: req.user.id, event_id: accessCode.event_id }
    });

    if (existing) {
      return res.status(409).json({ message: 'Already checked in.' });
    }

    const attendance = await Attendance.create({
      user_id: req.user.id,
      event_id: accessCode.event_id,
      device_info: req.headers['user-agent']
    });

    return res.status(201).json({ message: 'Check-in successful.', attendance });
  } catch (err) {
    return res.status(500).json({ message: 'Error checking in.' });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
      where: { event_id: req.params.id },
      include: [{ model: User, attributes: ['id', 'full_name', 'email'] }],
      order: [['checked_in_at', 'ASC']]
    });
    return res.json({ attendances });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching attendees.' });
  }
};

