const express = require('express');
const { checkout } = require('../controller/payment');

const router = express.Router();

router.post('/checkout', checkout);

module.exports = router;
