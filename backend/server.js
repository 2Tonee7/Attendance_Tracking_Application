import app from './src/app.js';
import { sequelize } from './src/models/index.js'; 
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database has been synchronized.');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);   
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });