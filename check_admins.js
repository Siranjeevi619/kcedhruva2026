require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const checkAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admins = await Admin.find({}, 'username role department');
        console.log('Admins in DB:', admins);
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
    }
};

checkAdmins();
