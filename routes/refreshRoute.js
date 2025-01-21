import express from 'express';
import { verifyRefreshToken } from './middlewares/auth.js';

const router = express.Router();

router.post('/refresh-token', verifyRefreshToken, (req, res) => {
    const userId = req.user.id;

    // Generate a new access token
    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.status(200).json({ access_token: newAccessToken });
});

export default router;
