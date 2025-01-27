import { Router } from "express";
import { checkIn, checkout, createStore, getAllActiveStores, getStoresById , getUserStores} from "../controllers/salesController.js";
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
salesRoute.get('/getallstoreofuser', verifyAccessToken,checkUserActive, getUserStores)

//to getstore by the user made
salesRoute.get("/getstore/:id", verifyAccessToken,checkUserActive, getStoresById);

export default salesRoute;