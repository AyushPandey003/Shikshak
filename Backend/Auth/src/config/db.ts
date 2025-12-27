import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../../../.config/.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || '');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
