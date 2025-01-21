import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./config/db.js";
import userRoute from "./routes/authRoute.js";
import salesRoute from "./routes/salesRoute.js";
import adminRoute from "./routes/adminRoute.js";




dotenv.config();
const app=express();
const PORT = process.env.PORT;
app.use(morgan('tiny'));
app.use(express.json());
app.use('/user',userRoute);
app.use('/store',salesRoute);
app.use('/admin',adminRoute);


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


