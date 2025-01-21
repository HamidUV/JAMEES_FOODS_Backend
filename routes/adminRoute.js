import { Router } from "express";
import { actvedeacitvesalesman, adminLogin, deleteStore, getallStoreAdmin, getallUserAdmin, geteachsalesmandetails, geteachStore } from "../controllers/adminController.js";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const adminRoute=Router();


//for admin alogin
adminRoute.post('/adminlogin',adminLogin);


//to get all stores for the admin
adminRoute.get('/getallstoreadmin',verifyAccessToken,getallStoreAdmin);


//to get each details ofthe admin
adminRoute.get('/geteachstore/:storeid',verifyAccessToken,geteachStore);


//to get all the users
adminRoute.get('/getalluseradmin',verifyAccessToken,getallUserAdmin);


//to get all details of the users
adminRoute.get('/geteachsalesmandetails/:userid',verifyAccessToken,geteachsalesmandetails);


//to activate and deactivate the salesman
adminRoute.put('/activate-deactivate/:userid',verifyAccessToken,actvedeacitvesalesman);


//to delete the store
adminRoute.delete('/deletestore/:storeid',verifyAccessToken,deleteStore)


export default adminRoute;