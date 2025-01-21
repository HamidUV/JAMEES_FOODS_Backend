import { Router } from "express";
import { checkIn, checkout, createStore, getallStore, getStoresById } from "../controllers/salesController.js";
import { verifyAccessToken} from "../middlewares/authMiddleware.js";



const salesRoute=Router();


//to create store
salesRoute.post('/createstore',verifyAccessToken,createStore);


//to checkin time
salesRoute.post('/checkin/:storeid',verifyAccessToken,checkIn);


//to checkout time
salesRoute.post('/checkout/:storeid',verifyAccessToken,checkout);


//to getallstore for the users
salesRoute.get('/getallstore',verifyAccessToken,getallStore);


//to getstore by the user made
salesRoute.get("/getstore/:id", verifyAccessToken, getStoresById);


export default salesRoute;