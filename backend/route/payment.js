const express = require('express');
const { deposit, verifyDeposit,getAllPayments,getUserPayments } = require('../controller/payment');
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/deposit', isLoggedIn, deposit);
router.get('/verify-deposit', verifyDeposit);
router.get('/all-payments', isLoggedIn, isAdmin, getAllPayments);
router.get('/user-payments/:userId', isLoggedIn, getUserPayments);

module.exports = router;
