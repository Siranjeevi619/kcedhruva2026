const Registration = require('../models/Registration');
const Event = require('../models/Event');
const axios = require('axios');
const { Parser } = require('json2csv');
const { sendRegistrationEmail } = require('../utils/email');

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Public
// @desc    Register for a Pass with selected Events
// @route   POST /api/registrations
// @access  Public
const registerForEvent = async (req, res) => {
    try {
        const { passId, eventIds, studentName, rollNumber, email, phone, department, year, college, district } = req.body;

        // 1. Fetch Pass
        const Pass = require('../models/Pass');
        const pass = await Pass.findById(passId);
        if (!pass) {
            return res.status(404).json({ message: 'Pass not found' });
        }

        // 2. Fetch Selected Events
        const events = await Event.find({ _id: { $in: eventIds } });
        if (events.length !== eventIds.length) {
            return res.status(400).json({ message: 'One or more invalid event IDs found' });
        }

        // 3. Generate Custom Ticket ID
        let prefix = 'D'; // Default
        const passName = pass.name.toLowerCase();

        if (passName.includes('standard')) prefix = 'ST';
        else if (passName.includes('elite')) prefix = 'E';
        else if (passName.includes('pro')) prefix = 'P';
        else if (passName.includes('dhruva pro')) prefix = 'D';
        else if (passName.includes('cultural')) prefix = 'C';
        else if (passName.includes('sports')) prefix = 'SP';

        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
        const ticketId = `${prefix}${randomNum}`;

        // 4. Determine Amount (Dynamic for Sports)
        let amountToPay = pass.price;
        if (passName.includes('sports') && events.length > 0) {
            // For sports, use the specific event's team price
            // Assuming strict one event selection for sports pass as per UI
            const sportsEvent = events[0];
            if (sportsEvent.teamPrice && sportsEvent.teamPrice > 0) {
                amountToPay = sportsEvent.teamPrice.toString(); // Convert to string to match schema
            }
        }

        // 5. Check Payment Status
        const enablePayment = process.env.ENABLE_PAYMENT === 'true';
        const initialStatus = enablePayment ? 'Pending' : 'Completed';

        // 6. Create Registration
        const registration = new Registration({
            pass: passId,
            events: eventIds,
            studentName,
            rollNumber,
            email,
            phone,
            department,
            year,
            college,
            district,
            amount: amountToPay,
            paymentStatus: initialStatus,
            ticketId: ticketId
        });

        const savedRegistration = await registration.save();

        // 6. Log to Google Sheet (if payment bypassed)
        if (!enablePayment) {
            const { logToSheet } = require('../utils/googleSheets');
            await logToSheet({
                email,
                studentName,
                rollNumber,
                year,
                department,
                phone,
                college,
                district,
                passName: pass.name,
                passId: passId,
                amount: pass.price,
                paymentStatus: 'Bypassed/Completed'
            });
        }

        res.status(201).json({
            message: enablePayment ? 'Registration initiated' : 'Registration Completed',
            registrationId: savedRegistration._id,
            amount: pass.price,
            paymentStatus: initialStatus
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export Registrations to CSV
// @route   GET /api/registrations/export
// @access  Private/Admin
const exportRegistrations = async (req, res) => {
    try {
        // Fetch all registrations regardless of payment status
        const registrations = await Registration.find().populate('pass', 'name price').sort({ createdAt: -1 });

        // Convert to CSV friendly JSON
        const data = registrations.map(reg => ({
            TicketID: reg.ticketId || 'N/A',
            PassName: reg.pass?.name || 'N/A',
            PassID: reg.pass?._id || 'N/A',
            Student: reg.studentName,
            RollNo: reg.rollNumber,
            Email: reg.email,
            Phone: reg.phone,
            Dept: reg.department,
            Year: reg.year,
            Amount: reg.amount,
            Status: reg.paymentStatus,
            PaymentID: reg.paymentId || 'N/A',
            Date: reg.createdAt.toISOString().split('T')[0]
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('all_registrations.csv');
        res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Registrations (for Admin Dashboard)
// @route   GET /api/registrations/all
// @access  Private/Admin
const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('pass', 'name price')
            .sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Trigger Report Generation (Send to n8n)
// @route   POST /api/registrations/trigger-report
// @access  Private/Admin
// const triggerReport = async (req, res) => {
//     try {
//         const { type } = req.body; // 'HOD' or 'Club'

//         // Fetch data
//         const registrations = await Registration.find().populate('event');

//         // In a real scenario, we might batch this or save to a file and send URL
//         // Sending payload to n8n

//         const n8nUrl = process.env.N8N_WEBHOOK_URL_REPORT;

//         if (n8nUrl) {
//             // Non-blocking call or await? Await to confirm triggered
//             await axios.post(n8nUrl, {
//                 type,
//                 timestamp: new Date(),
//                 registrations: registrations.slice(0, 100) // Limit payload size for safety
//             });
//             res.json({ message: 'Report generation triggered via n8n' });
//         } else {
//             res.status(503).json({ message: 'n8n Webhook URL not configured' });
//         }

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// @desc    Get registrations for a specific event
// @route   GET /api/registrations/events/:eventId
// @access  Private/Admin/HOD/Principal
const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        const registrations = await Registration.find({ events: eventId })
            .populate('pass', 'name')
            .select('studentName rollNumber email phone department year college district pass amount paymentStatus createdAt');

        res.json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export registrations for a specific event to CSV
// @route   GET /api/registrations/events/:eventId/export
// @access  Private/Admin/HOD/Principal
const exportEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const registrations = await Registration.find({ events: eventId })
            .populate('pass', 'name')
            .select('studentName rollNumber email phone department year college district pass amount paymentStatus createdAt');

        const data = registrations.map(reg => ({
            Student: reg.studentName,
            RollNo: reg.rollNumber,
            Email: reg.email,
            Phone: reg.phone,
            Dept: reg.department,
            Year: reg.year,
            College: reg.college,
            District: reg.district,
            Pass: reg.pass?.name || 'N/A',
            Status: reg.paymentStatus,
            RegisteredAt: reg.createdAt.toISOString().split('T')[0]
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment(`${event.title}_participants.csv`);
        res.send(csv);

    } catch (error) {
        console.error(error);
        // If header sent, we can't send json error, but usually we catch early errors
        if (!res.headersSent) res.status(500).json({ message: error.message });
    }
};

// @desc    Pre-register for an event (Interest/Coming Soon)
// @route   POST /api/registrations/pre-register
// @access  Public
const preRegister = async (req, res) => {
    try {
        const { passId, eventIds, studentName, rollNumber, email, phone, department, year, college, district } = req.body;

        const Pass = require('../models/Pass');
        const pass = await Pass.findById(passId);

        const registration = new Registration({
            pass: passId,
            events: eventIds,
            studentName,
            rollNumber,
            email,
            phone,
            department,
            year,
            college,
            district,
            amount: pass ? pass.price : '0',
            paymentStatus: 'Pre-Registered',
            ticketId: `PRE${Math.floor(1000 + Math.random() * 9000)}`
        });

        await registration.save();

        // Log to Google Sheet
        const { logToSheet } = require('../utils/googleSheets');
        await logToSheet({
            email,
            studentName,
            rollNumber,
            year,
            department,
            phone,
            college,
            district,
            passName: pass ? pass.name : 'N/A',
            passId: passId,
            amount: pass ? pass.price : '0',
            paymentStatus: 'Pre-Registered'
        });

        res.status(201).json({ message: 'Interest registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

//Original exports plus new ones
module.exports = {
    registerForEvent,
    preRegister,
    exportRegistrations, // Global export
    getAllRegistrations, // New endpoint for dashboard
    getEventRegistrations,
    exportEventRegistrations
};
