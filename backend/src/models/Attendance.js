import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Attendance = sequelize.define('Attendance', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    checked_in_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    device_info: { 
        type: DataTypes.STRING 
    }
}, { timestamps: true });

export default Attendance;