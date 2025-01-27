import {Router} from 'express';
import { refreshAccessToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/refresh-token',refreshAccessToken);

export default router;