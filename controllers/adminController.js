// adminLogin
// getAllStores
// get each Store Deails
// de-activate & activate sales men's
// get all sales men datas
// get each sales men details
//delete store

import jwt from "jsonwebtoken"; 
import Store from "../models/storeModel.js";
import User from "../models/userModel.js";
import Visit from "../models/visitModel.js";



//adminlogin

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body

    // Fixed admin credentials (stored securely in environment variables)
    const adminEmail = process.env.ADMIN_EMAIL; // e.g., "admin@example.com"
    const adminPassword = process.env.ADMIN_PASSWORD; // e.g., "securepassword123"

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if provided email and password match the fixed credentials
    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { role: "admin" }, // You can include additional info if needed
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Respond with token
    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        email: adminEmail,
      },
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Server error" });
  }
};






//getallstores

export const getallStoreAdmin = async (req, res) => {
    try {
      // Fetch all stores from the database
      const stores = await Store.findAll();
  
      if (!stores || stores.length === 0) {
        return res.status(404).json({ message: "No stores found" });
      }
  
      res.status(200).json({
        message: "Stores retrieved successfully",
        stores,
      });
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ message: "Server error" });
    }
  };



  //geteachStore

  export const geteachStore = async (req, res) => {
    try {
      const  store_id  = req.params.storeid; 
      console.log("Requested Store ID:", store_id);
  
    
      if (!store_id) {
        return res.status(400).json({ message: "Store ID is required" });
      }
  
      
      const store = await Store.findOne({where: {store_id: store_id} });
  
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
  
      res.status(200).json({
        message: "Store retrieved successfully",
        store,
      });
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ message: "Server error" });
    }
  };





  //get all saleman

  export const getallUserAdmin = async (req, res) => {
    try {
      // Fetch all stores from the database
      const users = await User.findAll();
  
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No salesman found" });
      }
  
      res.status(200).json({
        message: "users retrieved successfully",
        users,
      });
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ message: "Server error" });
    }
  };








 //get each sales man details

 export const geteachsalesmandetails= async (req,res)=>{
    try{
        const user_id = req.params.userid;
        console.log(user_id);

        if(!user_id){
        return res.status(404).json({ message: "User Id not found" });        
        }

        const user = await User.findOne({where: {user_id: user_id} });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
          }


        const visit = await Visit.findAll( { where :{user_id:user_id}});
          if (!visit) {
        return res.status(404).json({ message: "Visit details not found" });
      }
      res.status(200).json({
        message: "Store retrieved successfully",
        user,
        visit
      });

    }
    catch(error){
        console.error("Error fetching store:", error);
        res.status(500).json({ message: "Server error" });

    }

 }




 //to activate and deactivate salesman


 export const actvedeacitvesalesman = async (req, res) => {
   try {
     const  user_id  = req.params.userid; // Extract user_id from request parameters
     console.log(user_id);
 
     // Validate user_id
     if (!user_id) {
       return res.status(400).json({ message: "User ID is required" });
     }
 
     // Find the user by ID
     const user = await User.findOne({ where: { user_id } });
 
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
 
     // Check current status and toggle
     if (user.isActive) {
       user.isActive = false;
       await user.save();
       res.status(200).json({
         message: "User deactivated successfully",
         user: {
           user_id: user.user_id,
           user_name: user.user_name,
           isActive: user.isActive,
         },
       });
     } else {
       user.isActive = true;
       await user.save();
       res.status(200).json({
         message: "User activated successfully",
         user: {
           user_id: user.user_id,
           user_name: user.user_name,
           isActive: user.isActive,
         },
       });
     }
   } catch (error) {
     console.error("Error toggling activation status:", error);
     res.status(500).json({ message: "Server error" });
   }
 };
 




 //to delete the stores


 export const deleteStore = async (req, res) => {
   try {
     // Extract the store ID from the request parameters
     const  store_id  = req.params.storeid;
 
     if (!store_id) {
       return res.status(400).json({ message: "Store ID is required" });
     }
 
     // Find the store to ensure it exists
     const store = await Store.findByPk(store_id);
 
     if (!store) {
       return res.status(404).json({ message: "Store not found" });
     }
 
     // Delete the store
     await store.destroy();
 
     // Respond with success
     return res.status(200).json({ message: "Store deleted successfully" });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: "Error deleting store", error });
   }
 };
 