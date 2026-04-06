const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
});

module.exports = Order;