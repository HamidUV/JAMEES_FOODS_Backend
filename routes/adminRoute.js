import { Router } from "express";
import { adminLogin, deacitvestores, getallStoreAdmin, getAllUsersExceptAdmins, getEachSalesmanDetails, geteachStore, toggleUserStatus, getTotalUsersCount, getTotalStoresCount } from "../controllers/adminController.js";
import { verifyAccessToken, verifyAdminRole } from "../middlewares/authMiddleware.js";

const adminRoute=Router();


//for admin alogin
adminRoute.post('/adminlogin',adminLogin);


//to get all stores for the admin
adminRoute.get('/getallstoreadmin',verifyAccessToken,verifyAdminRole,getallStoreAdmin);


//to get each details ofthe admin
adminRoute.get('/geteachstore/:storeid',verifyAccessToken,verifyAdminRole,geteachStore);


//to get all the users
adminRoute.get('/getalluseradmin',verifyAccessToken,verifyAdminRole,getAllUsersExceptAdmins);


//to get all details of the users
adminRoute.get('/geteachsalesmandetails/:userid',verifyAccessToken,verifyAdminRole,getEachSalesmanDetails);


//to activate and deactivate the salesman
adminRoute.put('/activate-deactivate-user/:userid',verifyAccessToken,verifyAdminRole,toggleUserStatus);


//to delete the store
adminRoute.put('/activate-deactivate-store/:storeid',verifyAccessToken,verifyAdminRole,deacitvestores);

//delete or deactivate
// adminRoute.delete('/deletestore/:storeid',verifyAccessToken,deleteStore)


// create stores count - active & deactive stores

// create users count - active & deactive users

// Get total count of users (active & deactivated)
adminRoute.get('/users/count', verifyAccessToken, verifyAdminRole,getTotalUsersCount);

// Get total count of stores (active & deactivated)
adminRoute.get('/stores/count', verifyAccessToken,verifyAdminRole, getTotalStoresCount);

export default adminRoute;