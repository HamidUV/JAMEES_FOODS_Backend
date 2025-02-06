// authMiddleware
// isAdmin
// authAdminMiddleware
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js'

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

// export const verifyRefreshToken = (req, res, next) => {
//     const refreshToken = req.body.refreshToken; // Assuming refreshToken is sent in the request body
//     console.log(refreshToken,'refresh token');

//     if (!refreshToken) {
//         return res.status(401).json({ message: 'Refresh token is required' });
//     }

//     // Verify the refresh token
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid or expired refresh token' });
//         }

//         // Optionally, you can check the token against a database or cache
//         // Example:
//         // const isTokenValid = await checkTokenInDatabase(refreshToken);
//         // if (!isTokenValid) {
//         //     return res.status(403).json({ message: 'Refresh token is no longer valid' });
//         // }

//         // Attach user info from the refresh token to the request object
//         req.user = decoded;
//         next();
//     });
// };


export const refreshAccessToken = (req, res, next) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(401).json({ message: 'Refresh token is required' });
    };

    jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        // Generate a new access token using the user ID from the refresh token
        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ access_token: newAccessToken });
    });
};


export const checkUserActive = async (req, res, next) => {
    try {
        const userId = req.user.id;  // Assuming `req.user.id` is set by the access token

        // Find the user by ID
        const user = await User.findOne({
            where: { user_id: userId }
        });

        // If the user is not found or not active, send a response
        if (!user || !user.is_active) {
            return res.status(403).json({ message: "Your account is deactivated" });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// export const verifyAdminAccessToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];

//     if (!authHeader) {
//         return res.status(401).json({ message: 'Access token is required' });
//     }

//     const token = authHeader.split(' ')[1]; // Format should be "Bearer <token>"
//     if (!token) {
//         return res.status(401).json({ message: 'Invalid access token format' });
//     }

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid or expired access token' });
//         }

//         // Attach user info from the token to the request object
//         req.user = decoded;
//         next();
//     });
// };


export const verifyAdminRole = (req, res, next) => {
    if (!req.user || req.user.role !== "Admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
