require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Admin = require('./models/Admin');

const updateDepartments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');

        // Update Events
        const eventRes = await Event.updateMany(
            { department: { $in: ['CSD', 'CST'] } },
            { $set: { department: 'CSD-CST' } }
        );
        console.log(`Updated ${eventRes.modifiedCount} events from CSD/CST to CSD-CST`);

        // Update Admins
        const adminRes = await Admin.updateMany(
            { department: { $in: ['CSD', 'CST'] } },
            { $set: { department: 'CSD-CST' } }
        );
        console.log(`Updated ${adminRes.modifiedCount} admins from CSD/CST to CSD-CST`);

        console.log('Update complete');
    } catch (error) {
        console.error('Error updating departments:', error);
    } finally {
        await mongoose.connection.close();
    }
};

updateDepartments();
