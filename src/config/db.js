import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    const connURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-attendance';
    
    const options = {
      autoIndex: true, // Build indexes automatically (great for development/small projects)
    };

    const conn = await mongoose.connect(connURI, options);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB Connection Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB Disconnected.');
    });

  } catch (error) {
    logger.error(`MongoDB Connection Fail: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
