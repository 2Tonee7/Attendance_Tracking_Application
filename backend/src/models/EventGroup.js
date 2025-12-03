import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EventGroup = sequelize.define('EventGroup', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT 
    },
    recurrence_type: { 
        type: DataTypes.STRING, 
        defaultValue: 'none' 
    },
    start_date: { 
        type: DataTypes.DATEONLY 
    },
    end_date: { 
        type: DataTypes.DATEONLY 
    }
}, { timestamps: true });

export default EventGroup;