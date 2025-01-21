import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();
    
export const signup = async (req, res, next) => {
    try {
        console.log(req.body);
        const { user_name, user_email, user_password } = req.body;

        if (!user_name || !user_password || !user_email) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);

        const userData = await User.create({
            user_name,
            user_email,
            user_password: hashedPassword
        });

        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
            return res.status(500).send({ message: 'Server misconfiguration: Missing JWT secret' });
        }

        let access_token = jwt.sign({ id: userData.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' }); //access_token
        let refresh_token = jwt.sign({ id: userData.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); //refresh_token

        res.status(200).json({
            message: "You are in",
            access_token,
            refresh_token
        });
        console.log('User created');
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
};



export const login = async (req, res, next) => {
    try {
        let { user_email, user_password } = req.body;
        if (!user_email) throw { email: "emaial is required" };
        if (!user_password) throw { name: "Password is required" };
        let user = await User.findOne({
            where: {
                user_email
            }
        });
        console.log(user.user_id);
        console.log('gj');
        
        
        
        if (!user) throw { name: "Invalid name/password" };
        let valid = await bcrypt.compare(user_password, user.user_password); 
                
        if (!valid) throw { name: "Invalid name/password" };
        let access_token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET); 
        let refresh_token = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });//refresh_token

      
        res.status(200).json({ message:"your are logged in",access_token,refresh_token });
    } catch (error) {
        next(error);
    }
}
