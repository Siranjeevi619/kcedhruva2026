const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of default
            family: 4 // Force IPv4 (often fixes DNS resolution issues with Atlas)
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Instead of exiting, we bisa try to log it and let the server handle it
        // process.exit(1); 
    }
};

module.exports = connectDB;
