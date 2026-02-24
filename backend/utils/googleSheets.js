const axios = require('axios');

const logToSheet = async (data) => {
    try {
        const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

        if (!scriptUrl) {
            console.warn('Google Sheets logging skipped: GOOGLE_SCRIPT_URL not in .env');
            return;
        }

        // Prepare row data
        // Order: Email, Name, Roll No, Year, Department, Phone, College, District, Pass, Pass ID, Amount, Payment Status
        const payload = {
            email: data.email, // Added Email
            studentName: data.studentName,
            // rollNumber: data.rollNumber,
            year: data.year,
            department: data.department,
            phone: data.phone,
            college: data.college,
            district: data.district,
            passName: data.passName,
            passId: data.passId,
            amount: data.amount,
            paymentStatus: data.paymentStatus,
            ticketId: data.ticketId,
            qrCode: data.qrCode,
            reason: data.reason || ''
        };

        await axios.post(scriptUrl, payload);

        console.log('Logged to Google Sheet via Webhook');
    } catch (error) {
        console.error('Error logging to Google Sheet:', error.message);
    }
};

module.exports = { logToSheet };
