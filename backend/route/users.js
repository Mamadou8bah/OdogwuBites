const express = require('express');
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');
const { listUsers, getUserById } = require('../controller/users');

const router = express.Router();

router.get('/', isLoggedIn, isAdmin, listUsers);
router.get('/:id', isLoggedIn, isAdmin, getUserById);

module.exports = router;
