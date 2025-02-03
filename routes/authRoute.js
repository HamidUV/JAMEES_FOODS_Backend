import { Router } from "express";
import { login, signup , getUserProfile, updateUserProfile} from "../controllers/authController.js";
import {verifyAccessToken} from '../middlewares/authMiddleware.js';

const userRoute=Router();
userRoute.post('/signup',signup);
userRoute.post('/login',login);
// userRoute.delete('/logout', logout);
//add edit profile route
// Get profile data
userRoute.get('/profile', verifyAccessToken, getUserProfile);

// Update profile
userRoute.patch('/profile', verifyAccessToken, updateUserProfile);


export default userRoute;