require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const checkDepts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const events = await Event.find({}, 'department');
        const depts = [...new Set(events.map(e => e.department))];
        console.log('Unique departments in DB:', depts);
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
    }
};

checkDepts();
