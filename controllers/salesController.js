import { Op } from "sequelize";
import Store from "../models/storeModel.js";
import User from "../models/userModel.js";
import Visit from "../models/visitModel.js";

// Define allowed Emirates
const EMIRATES = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al-Quwain", "Ras Al Khaimah", "Fujairah"];

// Create Store
export const createStore = async (req, res, next) => {
    try {
        const { store_name, store_phonenumber, store_area, store_emirate } = req.body;
        const user_id = req.user.id; // From decoded JWT

        // Validate required fields
        if (!store_name || !store_phonenumber || !store_area || !store_emirate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate store_emirate
        if (!EMIRATES.includes(store_emirate)) {
            return res.status(400).json({ message: 'Invalid emirate. Choose from Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al-Quwain, Ras Al Khaimah, Fujairah' });
        }

        // Check if store with same name and emirate already exists
        const existingStore = await Store.findOne({
            where: {
                [Op.or]: [
                    { store_name, store_area, store_emirate },
                    { store_phonenumber }
                ]
            }
        });

        if (existingStore) {
            return res.status(409).json({ message: 'A store with this name or phone number already exists' });
        }

        // Find the user by ID
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new store
        const newStore = await Store.create({
            store_name,
            store_phonenumber,
            store_area,
            store_emirate,
            created_by: user_id
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

// Check-in
export const checkIn = async (req, res, next) => {
    try {
        const store_id = req.params.storeid;
        const store = await Store.findByPk(store_id);

        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        const visit = await Visit.create({
            user_id: req.user.id,
            store_id,
            store_name: store.store_name, // Store the store name in the visit record
            checkInTime: Date()
        });

        res.status(201).json({ message: "Check-in successful", visit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Checkout
export const checkout = async (req, res, next) => {
    try {
        const { sales_Amount } = req.body;
        const user_id = req.user.id;

        if (!sales_Amount) {
            return res.status(400).json({ message: 'Sales amount is required' });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the ongoing visit
        const visit = await Visit.findOne({
            where: {
                user_id,
                checkout_Time: null
            }
        });

        if (!visit) {
            return res.status(404).json({ message: 'No ongoing visit found to checkout' });
        }

        // Update visit with sales amount and checkout time
        await visit.update({
            sales_Amount,
            checkout_Time: new Date()
        });

        res.status(200).json({ message: "Checkout successful", visit });

    } catch (err) {
        console.error("Error during checkout:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get all active stores
export const getAllActiveStores = async (req, res) => {
    try {
        const activeStores = await Store.findAll({ where: { is_active: true } });

        if (!activeStores.length) {
            return res.status(404).json({ message: "No active stores found" });
        }

        res.status(200).json({ message: "Active stores retrieved successfully", stores: activeStores });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all stores of a user (both active and inactive)
export const getUserStores = async (req, res) => {
    try {
        const user_id = req.user.id;
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userStores = await Store.findAll({ where: { created_by: user_id } });

        if (!userStores.length) {
            return res.status(404).json({ message: "No stores found for this user" });
        }

        const activeStores = userStores.filter(store => store.is_active);
        const deactivatedStores = userStores.filter(store => !store.is_active);

        res.status(200).json({ message: "User's stores retrieved successfully", activeStores, deactivatedStores });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get stores by user ID
// Get store by store ID
export const getStoreById = async (req, res) => {
    try {
        const store_id = req.params.id;
        const store = await Store.findByPk(store_id);

        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
