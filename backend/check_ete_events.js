require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const checkEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- DB Check Start ---');

        // Find ALL events and print their departments
        const events = await Event.find({}, 'title department category');

        console.log(`Total events: ${events.length}`);

        const eteEvents = events.filter(e =>
            (e.department && (e.department.includes('ETE') || e.department.includes('VLSI')))
        );

        console.log(`Events matching ETE/VLSI: ${eteEvents.length}`);
        eteEvents.forEach(e => {
            console.log(`ID: ${e._id}, Title: "${e.title}", Dept: "${e.department}", Category: "${e.category}"`);
        });

        console.log('--- DB Check End ---');

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
    }
};

checkEvents();
