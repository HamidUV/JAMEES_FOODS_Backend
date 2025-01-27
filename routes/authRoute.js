import { Router } from "express";
import { login, logout, signup } from "../controllers/authController.js";

const userRoute=Router();
userRoute.post('/signup',signup);
userRoute.post('/login',login);
userRoute.delete('/logout', logout);

export default userRoute;