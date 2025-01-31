import { DataTypes } from "sequelize";
import dbConnection from "../config/db.js";

const User = dbConnection.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
    },
    user_phone: {  // New field for phone number
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true, // Ensure it's a numeric value
            len: [10, 15] // Restrict length between 10 to 15 digits
        },
    },
    user_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Salesman'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Default to active
    }
}, {
    tableName: 'users',
    timestamps: false,
});

export default User;
