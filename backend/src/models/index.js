import sequelize from '../config/database.js'; 
import User from './User.js';
import EventGroup from './EventGroup.js';
import Event from './Event.js';
import AccessCode from './AccessCode.js';
import Attendance from './Attendance.js';

User.hasMany(EventGroup, {foreignKey: 'organizer_id', as: 'organizedGroups'});
EventGroup.belongsTo(User, {foreignKey: 'organizer_id', as: 'organizer'});

EventGroup.hasMany(Event, { 
  foreignKey: 'group_id', 
  as: 'events',
  onDelete: 'CASCADE' 
});
Event.belongsTo(EventGroup, { foreignKey: 'group_id', as: 'group' });

Event.hasOne(AccessCode, { foreignKey: 'event_id', as: 'accessCode' });
AccessCode.belongsTo(Event, { foreignKey: 'event_id' });

User.belongsToMany(Event, { through: Attendance, foreignKey: 'user_id', as: 'attendedEvents' });
Event.belongsToMany(User, { through: Attendance, foreignKey: 'event_id', as: 'participants' });

Attendance.belongsTo(User, { foreignKey: 'user_id' });
Attendance.belongsTo(Event, { foreignKey: 'event_id' });
User.hasMany(Attendance, { foreignKey: 'user_id' });
Event.hasMany(Attendance, { foreignKey: 'event_id' });

export {
    sequelize,
    User,
    EventGroup,
    Event,
    AccessCode,
    Attendance
};