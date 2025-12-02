const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../model/Users');
dotenv.config();

const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const isStaff = (req, res, next) => {
    if (req.user.role === 'staff' || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
};

module.exports = { isLoggedIn, isStaff, isAdmin };
