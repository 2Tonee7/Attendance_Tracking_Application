import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const Event = sequelize.define('Event', {
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
    start_time: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    end_time: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    status: { 
        type: DataTypes.ENUM('OPEN', 'CLOSED', 'CANCELLED'), 
        defaultValue: 'CLOSED' 
    }
}, { timestamps: true });

export default Event;