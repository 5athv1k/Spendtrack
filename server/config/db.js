const mongoose = require('mongoose');

/**
 * Connect to MongoDB using connection string from environment variables
 * Supports both local MongoDB and MongoDB Atlas URIs
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
