import { Router } from "express";
import { checkIn, checkout, createStore, getAllActiveStores, getStoreById , getUserStores} from "../controllers/salesController.js";
import { verifyAccessToken, checkUserActive} from "../middlewares/authMiddleware.js";

const salesRoute=Router();

//to create store
salesRoute.post('/createstore',verifyAccessToken,checkUserActive,createStore);

//to checkin time
salesRoute.post('/checkin/:storeid',verifyAccessToken,checkUserActive,checkIn);

//to checkout time
salesRoute.post('/checkout/:storeid',verifyAccessToken,checkUserActive,checkout);

//to getallstore for the users
salesRoute.get('/getallstore',verifyAccessToken,checkUserActive,getAllActiveStores);

//to get all stores of a user
salesRoute.get('/getallstoreofuser', verifyAccessToken,checkUserActive, getUserStores);

// Get store by store ID
salesRoute.get("/getstore/:id", verifyAccessToken,checkUserActive, getStoreById);

export default salesRoute;