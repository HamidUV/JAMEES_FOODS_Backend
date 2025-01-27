import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./config/db.js";
import userRoute from "./routes/authRoute.js";
import salesRoute from "./routes/salesRoute.js";
import adminRoute from "./routes/adminRoute.js";
import router from "./routes/refreshRoute.js";
// import User from './models/userModel.js';
// import bcrypt from 'bcrypt';


dotenv.config();
const app=express();
const PORT = process.env.PORT;
app.use(morgan('tiny'));
app.use(express.json());
app.use('/user',userRoute);
app.use('/store',salesRoute);
app.use('/admin',adminRoute);
app.use('/',router);



// const seedAdmin = async () => {
//   try {
//     const hashedPassword = await bcrypt.hash("admin@1234", 10); // Hash the admin password
//     await User.create({
//       user_name: "Admin User",
//       user_email: "admin@example.com", // Use a secure email
//       user_password: hashedPassword,
//       user_role: "Admin",
//     });
//     console.log("Admin user created successfully.");
//   } catch (error) {
//     console.error("Error creating admin user:", error);
//   }
// };

// seedAdmin();



dbConnection.sync()
.then(()=>{
    console.log("Database & tables cerated");
})
.catch((err)=>{
    console.log("failed to sync database:",err);
});


app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
    });


