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
        allowNull: true, // Email is optional
        defaultValue: "", // Default to an empty string if not provided
    },
    user_phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15]
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
        defaultValue: true,
    }
}, {
    tableName: 'users',
    timestamps: false,
});

export default User;
