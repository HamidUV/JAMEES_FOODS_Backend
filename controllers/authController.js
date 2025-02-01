import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();
    
export const signup = async (req, res, next) => {
    try {
        console.log(req.body);
        const { user_name, user_email, user_phone, user_password } = req.body;

        // Validate required fields
        if (!user_name || !user_email || !user_phone || !user_password) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        // Check if email or phone number already exists
        // const existingUser = await User.findOne({ where: { user_email } });
        const existingPhone = await User.findOne({ where: { user_phone } });

        // if (existingUser) {
        //     return res.status(409).json({ message: "Email is already in use" });
        // }

        if (existingPhone) {
            return res.status(409).json({ message: "Phone number is already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(user_password, 10);

        // Create user
        const userData = await User.create({
            user_name,
            user_email,
            user_phone,
            user_password: hashedPassword
        });

        // Check for JWT secrets in environment variables
        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
            return res.status(500).send({ message: 'Server misconfiguration: Missing JWT secret' });
        }

        // Generate JWT tokens
        let access_token = jwt.sign({ id: userData.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        let refresh_token = jwt.sign({ id: userData.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: "Signup successful",
            access_token,
            refresh_token
        });

        console.log('User created');
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
};


// export const login = async (req, res, next) => {
//     try {
//         let { user_email, user_password } = req.body;
//         if (!user_email) throw { email: "emaial is required" };
//         if (!user_password) throw { name: "Password is required" };
//         let user = await User.findOne({
//             where: {
//                 user_email
//             }
//         });
//         console.log(user.user_id);
//         console.log('gj');
        
        
        
//         if (!user) throw { name: "Invalid name/password" };
//         let valid = await bcrypt.compare(user_password, user.user_password); 
                
//         if (!valid) throw { name: "Invalid name/password" };
//         let access_token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET); 
//         let refresh_token = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });//refresh_token

      
//         res.status(200).json({ message:"your are logged in",access_token,refresh_token });
//     } catch (error) {
//         next(error);
//     }
// }

export const login = async (req, res, next) => {
    try {
        let { user_phone, user_password } = req.body;

        if (!user_phone) throw { phone: "Phone number is required" };
        if (!user_password) throw { name: "Password is required" };

        let user = await User.findOne({
            where: {
                user_phone
            }
        });

        // Check if user exists
        if (!user) throw { name: "Invalid phone number / password" };

        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({ message: "Your account is deactivated" });
        };
        console.log('active');
        // Validate password
        let valid = await bcrypt.compare(user_password, user.user_password); 

        if (!valid) throw { name: "Invalid password" };

        // Generate JWT tokens
        let access_token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        let refresh_token = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Send response with tokens
        res.status(200).json({ message: "You are logged in", access_token, refresh_token });
    } catch (error) {
        next(error);
    }
};


// export const logout = async (req,res) =>{
//     try{
//         const user = req.user ;


//     } catch {

//     }
// }