require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const checkEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- DB Check Start ---');

        const events = await Event.find({}, 'title winnerPrize runnerPrize rounds');

        events.forEach(e => {
            let hasIssue = false;
            const issues = [];

            if (e.winnerPrize === 'TBA' || e.winnerPrize === '') issues.push(`Winner: '${e.winnerPrize}'`);
            if (e.runnerPrize === 'TBA' || e.runnerPrize === '') issues.push(`Runner: '${e.runnerPrize}'`);
            if (e.rounds && e.rounds.length > 0) {
                const emptyRounds = e.rounds.filter(r => !r.name || r.name.trim() === '');
                if (emptyRounds.length > 0) {
                    issues.push(`Has ${emptyRounds.length} empty named rounds`);
                    hasIssue = true;
                }
                // Check if only 1 round and it is empty
                if (e.rounds.length === 1 && (!e.rounds[0].name || e.rounds[0].name === '')) {
                    issues.push("Single empty round detected");
                    hasIssue = true;
                }
            }

            if (issues.length > 0) {
                console.log(`Event: ${e.title}`);
                console.log(`  Issues: ${issues.join(', ')}`);
                console.log(`  Rounds raw: ${JSON.stringify(e.rounds)}`);
            }
        });

        console.log('--- DB Check End ---');

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
    }
};

checkEvents();
