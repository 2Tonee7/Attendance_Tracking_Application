import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    full_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false,  
        unique: true, 
        validate: { isEmail: true }
    },
    password: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    role: { 
        type: DataTypes.ENUM('organizer', 'participant', 'admin'), 
        defaultValue: 'participant' 
    }
}, { timestamps: true });

export default User;