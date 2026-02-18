const express = require('express');
const router = express.Router();
const { registerForEvent, preRegister, exportRegistrations, getAllRegistrations, getEventRegistrations, exportEventRegistrations } = require('../controllers/registrationController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', registerForEvent);
router.post('/pre-register', preRegister);
router.get('/export', protect, admin, exportRegistrations);
router.get('/all', protect, admin, getAllRegistrations);
// router.post('/trigger-report', protect, admin, triggerReport);
router.get('/events/:eventId', protect, admin, getEventRegistrations);
router.get('/events/:eventId/export', protect, admin, exportEventRegistrations);

module.exports = router;
