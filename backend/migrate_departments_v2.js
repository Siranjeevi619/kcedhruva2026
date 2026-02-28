require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Admin = require('./models/Admin');

const updateDepartments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');

        // Update Events
        const events = await Event.find({
            $or: [
                { department: /CSD/i },
                { department: /CST/i },
                { department: /Design/i },
                { department: /Technology/i }
            ]
        });

        console.log(`Found ${events.length} potential events to update`);
        let eventCount = 0;
        for (let event of events) {
            // Only update if it's strictly CSD, CST or one of the long names
            if (['CSD', 'CST', 'Department of Computer Science and Design', 'Department of Computer Science and Technology'].includes(event.department)) {
                event.department = 'CSD-CST';
                await event.save();
                eventCount++;
            }
        }
        console.log(`Updated ${eventCount} events to CSD-CST`);

        // Update Admins
        const admins = await Admin.find({
            $or: [
                { department: /CSD/i },
                { department: /CST/i }
            ]
        });
        console.log(`Found ${admins.length} potential admins to update`);
        let adminCount = 0;
        for (let admin of admins) {
            if (['CSD', 'CST', 'Department of Computer Science and Design', 'Department of Computer Science and Technology'].includes(admin.department)) {
                admin.department = 'CSD-CST';
                await admin.save();
                adminCount++;
            }
        }
        console.log(`Updated ${adminCount} admins to CSD-CST`);

    } catch (error) {
        console.error('Error updating departments:', error);
    } finally {
        await mongoose.connection.close();
    }
};

updateDepartments();
