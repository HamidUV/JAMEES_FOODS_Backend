// userId 
// storeId 
// checkInTime 
// checkOutTime
// salesAmount 

// belongsTo : User -> foreignKey : 'userId' 
// belongsTo : Store -> foreignKey : 'storeId'

import { DataTypes } from "sequelize";
import dbConnection from "../config/db.js";
import User from "./userModel.js";
import Store from "./storeModel.js";

const Visit = dbConnection.define('Visit', {
    visit_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Refers to the User model
            key: 'user_id',
        },
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Store, // Refers to the Store model
            key: 'store_id',
        },
    },
    checkin_Time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    checkout_Time: {
        type: DataTypes.DATE,
        allowNull: true, // Optional since checkout might not happen immediately
    },
    sales_Amount: {
        type: DataTypes.DECIMAL(10, 2), // For precise monetary values
        allowNull: false,
        defaultValue: 0.0, // Default to 0 in case no sales are made
    },
}, {
    tableName: 'visit',
    timestamps: false,
});

// Hook to set checkin_Time using Date.now()
Visit.beforeCreate((visit) => {
    if (!visit.checkin_Time) {
        visit.checkin_Time = new Date(Date.now()); // Convert timestamp to Date object
    }
});

// Define associations
Visit.belongsTo(User, { foreignKey: 'user_id' });
Visit.belongsTo(Store, { foreignKey: 'store_id' });

export default Visit;