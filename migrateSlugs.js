const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const Event = require('./models/Event');

const migrate = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const events = await Event.find();
        console.log(`Found ${events.length} events. Updating slugs...`);

        let updatedCount = 0;
        for (const event of events) {
            if (!event.slug) {
                let baseSlug = event.title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();

                if (!baseSlug) baseSlug = 'event';

                let slug = baseSlug;
                let counter = 1;

                // Check for uniqueness
                while (await Event.findOne({ slug, _id: { $ne: event._id } })) {
                    slug = `${baseSlug}-${counter}`;
                    counter++;
                }

                try {
                    event.slug = slug;
                    await event.save();
                    updatedCount++;
                    console.log(`Updated: "${event.title}" -> ${event.slug}`);
                } catch (err) {
                    console.error(`Failed to update event "${event.title}":`, err.message);
                }
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} events.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
