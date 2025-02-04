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
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';


//adminlogin

// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body; // Extract email and password from request body

//     // Fixed admin credentials (stored securely in environment variables)
//     const adminEmail = process.env.ADMIN_EMAIL; // e.g., "admin@example.com"
//     const adminPassword = process.env.ADMIN_PASSWORD; // e.g., "securepassword123"

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const admin = await User.find()

//     // Check if provided email and password match the fixed credentials
//     if (email !== adminEmail || password !== adminPassword) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { role: "admin" }, // You can include additional info if needed
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" } // Token expires in 1 day
//     );

//     // Respond with token
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       admin: {
//         email: adminEmail,
//       },
//     });
//   } catch (error) {
//     console.error("Error during admin login:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the user exists and has the role "Admin"
    const adminUser = await User.findOne({
      where: {
        user_email: email,
        user_role: "Admin",
      },
    });

    if (!adminUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, adminUser.user_password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: adminUser.user_id, role: adminUser.user_role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Respond with token and admin details
    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: adminUser.user_id,
        email: adminUser.user_email,
        role: adminUser.user_role,
      },
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//getallstores - Active and deactive stores

export const getallStoreAdmin = async (req, res) => {
  try {
    // Fetch all stores from the database
    const stores = await Store.findAll();

    if (!stores || stores.length === 0) {
      return res.status(404).json({ message: "No stores found" });
    }

    // Separate activated and deactivated stores
    const activatedStores = stores.filter(store => store.is_active);
    const deactivatedStores = stores.filter(store => !store.is_active);

    res.status(200).json({
      message: "Stores retrieved successfully",
      activatedStores,
      deactivatedStores,
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

  export const getAllUsersExceptAdmins = async (req, res) => {
    try {
      // Fetch all users where user_role is not 'Admin'
      const users = await User.findAll({
        where: {
          user_role: { [Op.ne]: 'Admin' }, // Exclude users with user_role as 'Admin'
        },
      });
  
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No salesmen found" });
      }
  
      res.status(200).json({
        message: "Users retrieved successfully",
        users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  


 //get each sales man details

 // Get each salesperson details (returns user even if no visits)
export const getEachSalesmanDetails = async (req, res) => {
  try {
      const user_id = req.params.userid;

      if (!user_id) {
          return res.status(400).json({ message: "User ID is required" });
      }

      // Fetch the user (excluding admins)
      const user = await User.findOne({
          where: {
              user_id: user_id,
              user_role: { [Op.ne]: 'Admin' },
          },
      });

      if (!user) {
          return res.status(404).json({ message: "User not found or is an admin" });
      }

      // Fetch visit details for the user
      const visit = await Visit.findAll({ where: { user_id: user_id } });

      res.status(200).json({
          message: "Details retrieved successfully",
          user,
          visits: visit.length ? visit : 0,
      });

  } catch (error) {
      console.error("Error fetching details:", error);
      res.status(500).json({ message: "Server error" });
  }
};



 //to activate and deactivate salesman


//  export const actvedeacitvesalesman = async (req, res) => {
//    try {
//      const  user_id  = req.params.userid; // Extract user_id from request parameters
//      console.log(user_id);
 
//      // Validate user_id
//      if (!user_id) {
//        return res.status(400).json({ message: "User ID is required" });
//      }
 
//      // Find the user by ID
//      const user = await User.findOne({ where: { user_id } });
 
//      if (!user) {
//        return res.status(404).json({ message: "User not found" });
//      }
 
//      // Check current status and toggle
//      if (user.isActive = false) {
//        user.isActive = false;
//        await user.save();
//        res.status(200).json({
//          message: "User deactivated successfully",
//          user: {
//            user_id: user.user_id,
//            user_name: user.user_name,
//            isActive: user.isActive,
//          },
//        });
//      } else {
//        user.isActive = true;
//        await user.save();
//        res.status(200).json({
//          message: "User activated successfully",
//          user: {
//            user_id: user.user_id,
//            user_name: user.user_name,
//            isActive: user.isActive,
//          },
//        });
//      }
//    } catch (error) {
//      console.error("Error toggling activation status:", error);
//      res.status(500).json({ message: "Server error" });
//    }
//  };
 

export const toggleUserStatus = async (req, res) => {
  try {
    const { userid } = req.params; // Extract user_id from request parameters
    console.log(userid);

    // Validate user_id
    if (!userid) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find the user by ID
    const user = await User.findOne({ where: { user_id: userid } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Toggle the activation status
    user.is_active = !user.is_active;
    await user.save();

    const updatedUser = await User.findOne({ where: { user_id: userid } }); 

    res.status(200).json({
      message: `User ${updatedUser.is_active ? "activated" : "deactivated"} successfully.`,
      user: {
        user_id: updatedUser.user_id,
        user_name: updatedUser.user_name,
        is_active: updatedUser.is_active,
      },
    });

  } catch (error) {
    console.error("Error toggling user activation status:", error);
    res.status(500).json({ message: "Server error." });
  }
};



 //to delete the stores - Here not possible if store have visits
//  export const deleteStore = async (req, res) => {
//   try {
//     const store_id = req.params.storeid;

//     if (!store_id) {
//       return res.status(400).json({ message: "Store ID is required" });
//     }

//     // Find the store to ensure it exists
//     const store = await Store.findByPk(store_id);

//     if (!store) {
//       return res.status(404).json({ message: "Store not found" });
//     }

//     // Check for dependent visits
//     const visits = await Visit.findAll({ where: { store_id } });

//     if (visits.length > 0) {
//       return res.status(400).json({
//         message: "Cannot delete store. Dependent visit records exist.",
//       });
//     }

//     // Delete the store
//     await store.destroy();

//     res.status(200).json({ message: "Store deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting store:", error);
//     res.status(500).json({ message: "Error deleting store", error });
//   }
// };

// anyway delete store if it have visits 
// export const deleteStore = async (req, res) => {
//   try {
//     const store_id = req.params.storeid;

//     if (!store_id) {
//       return res.status(400).json({ message: "Store ID is required" });
//     }

//     // Find the store to ensure it exists
//     const store = await Store.findByPk(store_id);

//     if (!store) {
//       return res.status(404).json({ message: "Store not found" });
//     }

//     // Delete dependent visits
//     await Visit.destroy({ where: { store_id } });

//     // Delete the store
//     await store.destroy();

//     res.status(200).json({ message: "Store and related visits deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting store:", error);
//     res.status(500).json({ message: "Error deleting store", error });
//   }
// };

 

export const deacitvestores = async (req, res) => { 
  try { 
    const  store_id  = req.params.storeid; // Extract user_id from request parameters 
    console.log(store_id); 
 
    // Validate user_id 
    if (!store_id) { 
      return res.status(400).json({ message: "Store ID is required" }); 
    } 
 
    // Find the user by ID 
    const store = await Store.findOne({ where: { store_id } }); 
 
    if (!store) { 
      return res.status(404).json({ message: "store not found" }); 
    } 
 
    // Check current status and toggle 
  store.is_active = !store.is_active 
 
  await store.save(); 
 
   
 
  // Respond with success 
  res.status(200).json({ 
    message: `User ${store.is_active ? "activated" : "deactivated"} successfully`, 
    user: { 
      user_id: store.store_id, 
      store_name: store.store_name, 
      store_area: store.store_area, 
      is_active: store.is_active, 
    }, 
  }); 
 
  } catch (error) { 
    console.error("Error toggling activation status:", error); 
    res.status(500).json({ message: "Server error" }); 
  } 
};



// Get total count of users (active & deactivated)
export const getTotalUsersCount = async (req, res) => {
  try {
      // Count active and deactivated users (excluding admins)
      const totalActiveUsers = await User.count({ where: { is_active: true, user_role: { [Op.ne]: 'Admin' } } });
      const totalDeactivatedUsers = await User.count({ where: { is_active: false, user_role: { [Op.ne]: 'Admin' } } });

      res.status(200).json({
          message: "User count retrieved successfully",
          totalUsers: totalActiveUsers + totalDeactivatedUsers,
          activeUsers: totalActiveUsers,
          deactivatedUsers: totalDeactivatedUsers,
      });
  } catch (error) {
      console.error("Error fetching user count:", error);
      res.status(500).json({ message: "Server error" });
  }
};

// Get total count of stores (active & deactivated)
export const getTotalStoresCount = async (req, res) => {
  try {
      // Count active and deactivated stores
      const totalActiveStores = await Store.count({ where: { is_active: true } });
      const totalDeactivatedStores = await Store.count({ where: { is_active: false } });

      res.status(200).json({
          message: "Store count retrieved successfully",
          totalStores: totalActiveStores + totalDeactivatedStores,
          activeStores: totalActiveStores,
          deactivatedStores: totalDeactivatedStores,
      });
  } catch (error) {
      console.error("Error fetching store count:", error);
      res.status(500).json({ message: "Server error" });
  }
};