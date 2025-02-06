import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();
    
export const signup = async (req, res, next) => {
    try {
        console.log(req.body);
        const { user_name,  user_phone, user_password } = req.body;

        // Validate required fields
        if (!user_name ||  !user_phone || !user_password) {
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
        let access_token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        let refresh_token = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

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


// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findOne({
            where: { user_id: userId },
            attributes: ['user_name', 'user_phone', 'user_email'] // Only return necessary fields
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { user_name, user_phone, user_password, user_email } = req.body;

        // Find the user
        const user = await User.findOne({ where: { user_id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if phone number already exists (excluding current user)
        if (user_phone && user_phone !== user.user_phone) {
            const existingPhone = await User.findOne({ where: { user_phone } });
            if (existingPhone) {
                return res.status(409).json({ message: "Phone number is already in use" });
            }
        }

        // Check if email already exists (excluding current user)
        if (user_email && user_email !== "" && user_email !== user.user_email) {
            const existingEmail = await User.findOne({ where: { user_email } });
            if (existingEmail) {
                return res.status(409).json({ message: "Email is already in use" });
            }
        }

        // Hash password if provided
        let hashedPassword = user.user_password;
        if (user_password) {
            hashedPassword = await bcrypt.hash(user_password, 10);
        }

        // Ensure email remains empty instead of null if not provided
        const newEmail = user_email !== undefined ? user_email : user.user_email || "";

        // Update user details
        await User.update(
            {
                user_name: user_name || user.user_name,
                user_phone: user_phone || user.user_phone,
                user_password: hashedPassword,
                user_email: newEmail // Ensure an empty string instead of null
            },
            { where: { user_id: userId } }
        );

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};