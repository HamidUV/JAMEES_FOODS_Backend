// name 
// email 
// password 
// role 
import { DataTypes } from "sequelize";
import dbConnection from "../config/db.js";


const User = dbConnection.define('User',{
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isEmail:true
        },
    },
    user_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'Salesman'
    },
    is_active:{
        type: DataTypes.BOOLEAN, // Changed to BOOLEAN for true/false values
      allowNull: false,
      defaultValue: true, // Default to active
    }
},
{
    tableName:'users',
    timestamps: false,
}
);



export default User;