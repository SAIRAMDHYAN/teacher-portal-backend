const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect('mongodb://127.0.0.1:27017/techer_portal');
        console.log('MongoDB connected:', connection.connection.host);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
       
    }
};


module.exports = connectDB;