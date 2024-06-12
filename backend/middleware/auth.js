// middleware/auth.js

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Check for Authorization header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token from header
    const token = authHeader.replace('Bearer ', '');

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your secret key here
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
