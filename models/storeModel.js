import { DataTypes } from "sequelize";
import dbConnection from "../config/db.js";
import User from "./userModel.js";

// Define allowed Emirates
const EMIRATES = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al-Quwain", "Ras Al Khaimah", "Fujairah"];

const Store = dbConnection.define('Store', {
    store_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    store_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    store_phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    store_area: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    store_emirate: {
        type: DataTypes.ENUM(...EMIRATES), // Using ENUM for predefined emirates
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Default all stores to be active initially
    },
}, {
    tableName: 'store',
    timestamps: false,
});

// Define the association between Store and User
Store.belongsTo(User, { foreignKey: 'created_by' });

export default Store;
