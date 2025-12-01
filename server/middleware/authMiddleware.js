const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config();
const isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (req.user) {
    next(); 
    } else {
      res.status(401).json({ message: 'Unauthorized' });
     }
}

const isStaff = (req, res, next) => {
    if (req.user.role === 'staff' || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
}
const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
}

module.exports = { isLoggedIn, isStaff, isAdmin };