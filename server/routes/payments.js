const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

// Create payment
router.post('/', auth, async (req, res) => {
  try {
    const {
      amount,
      paymentType,
      month,
      year,
      paymentDetails
    } = req.body;

    const payment = new Payment({
      userId: req.user.id,
      amount,
      paymentType,
      month,
      year,
      paymentDetails,
      transactionId: `TXN${Date.now()}`
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 