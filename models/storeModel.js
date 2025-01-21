// name
// contactNumber
// area
// emirate
// createdBy
import { DataTypes } from "sequelize";
import dbConnection from "../config/db.js";
import User from "./userModel.js";

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
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,  // The model the foreign key is referencing
            key: 'user_id', // The primary key in the User model
        },
        onDelete: 'CASCADE', // Optionally add a delete behavior for the foreign key
    },
}, {
    tableName: 'store',
    timestamps: false,
});

// Define the association between Store and User
Store.belongsTo(User, { foreignKey: 'created_by' });


export default Store;