const { Order, OrderItem, Cart, CartItem, Product } = require('../models');
const { sequelize } = require('../config/database');

const createOrder = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const cart = await Cart.findOne({
            where: { user_id: req.user.id },
            include: [{ model: CartItem, include: [{ model: Product }] }],
            transaction: t,
        });

        if (!cart || cart.CartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const total_price = cart.CartItems.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const order = await Order.create({
            user_id: req.user.id,
            status: 'pending',
            total_price: parseFloat(total_price.toFixed(2)),
        }, { transaction: t });

        const orderItems = cart.CartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
        }));

        await OrderItem.bulkCreate(orderItems, { transaction: t });
        await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
        await order.update({ status: 'completed' }, { transaction: t });

        await t.commit();

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        await t.rollback();
        next(err);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: OrderItem,
                include: [{ model: Product, attributes: ['id', 'name', 'image_url'] }],
            }],
            order: [['createdAt', 'DESC']],
        });

        res.json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

module.exports = { createOrder, getOrders };