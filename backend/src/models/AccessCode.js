import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AccessCode = sequelize.define('AccessCode', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    code: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    qr_code_url: { 
        type: DataTypes.TEXT 
    }, 
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, { timestamps: true });

export default AccessCode;