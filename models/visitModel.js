import { DataTypes } from "sequelize";
import dbConnection from "../config/db.js";
import User from "./userModel.js";
import Store from "./storeModel.js";
import moment from "moment";

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
            model: User,
            key: 'user_id',
        },
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Store,
            key: 'store_id',
        },
    },
    store_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    checkin_Time: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('checkin_Time');
            return rawValue ? moment(rawValue).format("YYYY-MM-DD HH:mm:ss") : null;
        }
    },
    checkout_Time: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('checkout_Time');
            return rawValue ? moment(rawValue).format("YYYY-MM-DD HH:mm:ss") : null;
        }
    },
    sales_Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
    },
}, {
    tableName: 'visit',
    timestamps: false,
});

// Hook to set checkin_Time using Date.now() in human-readable format
Visit.beforeCreate((visit) => {
    if (!visit.checkin_Time) {
        visit.checkin_Time = moment().toDate();
    }
});

Visit.beforeUpdate((visit) => {
    if (visit.changed('checkout_Time')) {
        visit.checkout_Time = moment().toDate();
    }
});

Visit.belongsTo(User, { foreignKey: 'user_id' });
Visit.belongsTo(Store, { foreignKey: 'store_id' });

export default Visit;
