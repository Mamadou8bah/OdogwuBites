const express = require('express');
const { deposit, verifyDeposit } = require('../controller/payment');
const { isLoggedIn } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/deposit', isLoggedIn, deposit);
router.get('/verify-deposit', verifyDeposit);

module.exports = router;
