const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controller/dashboard');
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

router.get('/stats', isLoggedIn, isAdmin, getDashboardStats);

module.exports = router;
