const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, handlePaymentFailed } = require('../controllers/paymentController');

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.post('/failed', handlePaymentFailed);

module.exports = router;
