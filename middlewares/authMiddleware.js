// authMiddleware
// isAdmin
// authAdminMiddleware
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyAccessToken = (req, res, next) => {
    // Extract token from the Authorization header
    const authHeader = req.headers['authorization'];
    

    if (!authHeader) {
        return res.status(401).json({ message: 'Access token is required' });
    }

    const token = authHeader.split(' ')[1]; // Assuming format is "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Invalid access token format' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired access token' });
        }

        // Attach user info from the token to the request object
        req.user = decoded;
        next();
    });
};


