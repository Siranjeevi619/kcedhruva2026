const mongoose = require('mongoose');
const Event = require('./models/Event');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const checkPrizes = async () => {
    await connectDB();
    try {
        const events = await Event.find().select('title prize winnerPrize runnerPrize');
        console.log(`Total Events: ${events.length}`);

        events.forEach(event => {
            console.log(`Event: ${event.title}`);
            console.log(`  - Prize (Generic): ${event.prize || 'N/A'}`);
            console.log(`  - Winner Prize: ${event.winnerPrize || 'N/A'}`);
            console.log(`  - Runner Prize: ${event.runnerPrize || 'N/A'}`);
            console.log('---');
        });

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

checkPrizes();
