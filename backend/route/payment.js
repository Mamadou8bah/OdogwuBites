const express = require('express');
const { deposit, verifyDeposit,getAllPayments,getUserPayments, confirmPayment } = require('../controller/payment');
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/deposit', isLoggedIn, deposit);
router.get('/verify-deposit', verifyDeposit);
router.get('/all-payments', isLoggedIn, isAdmin, getAllPayments);
router.get('/user-payments/:userId', isLoggedIn, getUserPayments);
router.patch('/confirm/:paymentId', isLoggedIn, isAdmin, confirmPayment);

module.exports = router;
