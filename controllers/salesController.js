// createStore
// checkIn
// checkOut


import { decrypt } from 'dotenv';
import Store from '../models/storeModel.js';  // Import the Store model
import User from '../models/userModel.js';    // Import the User model
import Visit from "../models/visitModel.js";



//createstore

export const createStore = async (req, res, next) => {
    try {
        const { store_name, store_phonenumber, store_area, store_emirate } = req.body;
        console.log(req.user.id);
        // console.log(req.user.user_id);
        
        
        const user_id = req.user.id; // From decoded JWT
        // Validate the required fields
        if (!store_name || !store_phonenumber || !store_area || !store_emirate ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find the user by created_by to check if the user exists (optional)
        const user = await User.findByPk(user_id);
        console.log(user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Create a new store
        const newStore = await Store.create({
            store_name,
            store_phonenumber,
            store_area,
            store_emirate,
            created_by:user_id // Store the user who created the store
        });

        return res.status(201).json({
            message: 'Store created successfully',
            store: newStore
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};




//checkin

export const checkIn = async (req,res,next)=>{
    console.log(req.params);
    
     const store_id  = req.params.storeid;
     console.log(store_id);
     
     try{
         
        const store = await Store.findByPk(store_id);
        console.log(store);
        
        if(!store){
            return res.status(404).json({message:"store not found"});
        }

        const visit = await Visit.create({
            user_id:req.user.id,
            store_id:store_id,
            checkInTime:new Date()
        });

        console.log(visit,'got store visit');
        
        res.status(201).json({message:"check in succeessffull",visit})
     }
     catch(err){
     res.status(500).json({message:err.message});
    }
}





//checkout

export const checkout = async (req, res, next) => {
    try {
        const { sales_Amount } = req.body; // Get sales amount from the request body
        const user_id = req.user.id; // Get user ID from decoded JWT (middleware)

        // Check if sales_Amount is provided
        if (!sales_Amount) {
            return res.status(400).json({ message: 'Sales amount is required' });
        }

        // Find the user using the user_id
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the visit record associated with this user and store
        const visit = await Visit.findOne({
            where: {
                user_id,          // Ensure we find the visit of the correct user
                checkout_Time: null, // Ensure we only checkout the visit that hasn't been checked out yet
            }
        });

        if (!visit) {
            return res.status(404).json({ message: 'No ongoing visit found to checkout' });
        }

        // Update the visit record with the sales amount and checkout time
        await visit.update({
            sales_Amount,             // Update the sales amount
            checkout_Time: new Date() // Set the checkout time to current timestamp
        });

        console.log(visit, 'Visit updated successfully');

        // Return the response with success
        res.status(200).json({
            message: "Checkout successful",
            visit,
        });

    } catch (err) {
        console.error("Error during checkout:", err);
        res.status(500).json({ message: err.message });
    }
};



//getallstore

export const getallStore = async (req, res) => {
    try {
        const user_id = req.userId; // This will be set by the authenticateToken middleware

        // Fetch books for the specific user, or all books if no user_id
        const store = await Store.findAll(user_id ? { where: { user_id } } : {});

        if (!store || store.length === 0) {
            return res.status(404).send({ message: 'No stores found' });
        }

        res.status(200).send({ store });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: error.message });
    }
};




//getstorebyid

export const getStoresById = async (req, res) => {
  try {
    const user_id = req.params.id; // Get user ID from route params
    console.log(user_id, 'user');

    // Find all stores created by the specific user
    const stores = await Store.findAll({ where: { created_by: user_id }});
    console.log(stores);
    
    if (stores.length === 0) {
      return res.status(404).json({ message: "No stores found for this user" });
    }

    res.status(200).json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Server error" });
  }
};



