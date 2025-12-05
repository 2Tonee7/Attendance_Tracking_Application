import cron from 'node-cron';
import { Event } from '../models/index.js';
import { Op } from 'sequelize';

export const startStatusUpdateJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      await Event.update(
        { status: 'OPEN' },
        { 
          where: { 
            status: 'CLOSED', 
            start_time: { [Op.lte]: now }, 
            end_time: { [Op.gt]: now } 
          } 
        }
      );

      await Event.update(
        { status: 'CLOSED' },
        { 
          where: { 
            status: 'OPEN', 
            end_time: { [Op.lte]: now } 
          } 
        }
      );
    } catch (err) {
      console.error('Status update error:', err);
    }
  });
  
  console.log('Cron started');
};

