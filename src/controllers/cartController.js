const { Cart, CartItem, Product } = require('../models');
const { sequelize } = require('../config/database');

const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            where: { user_id: req.user.id },
            include: [{
                model: CartItem,
                include: [{ model: Product, attributes: ['id', 'name', 'price', 'stock', 'image_url'] }],
            }],
        });

        if (!cart) {
            return res.json({ success: true, data: { items: [], total: 0 } });
        }

        const total = cart.CartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.json({ success: true, data: { cart, total: parseFloat(total.toFixed(2)) } });
    } catch (err) {
        next(err);
    }
};

const addToCart = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { product_id, quantity = 1 } = req.body;


        console.log('product_id:', product_id);

        const product = await Product.findByPk(product_id, {
            lock: t.LOCK.UPDATE,
            transaction: t });
        console.log('product:', product);
        if (!product) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.stock < quantity) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ where: { user_id: req.user.id }, transaction: t });
        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id }, { transaction: t });
        }

        let cartItem = await CartItem.findOne({
            where: { cart_id: cart.id, product_id },
            transaction: t,
        });

        if (cartItem) {
            await cartItem.update(
                { quantity: cartItem.quantity + quantity },
                { transaction: t }
            );
        } else {
            cartItem = await CartItem.create({
                cart_id: cart.id,
                product_id,
                quantity,
                price: product.price,
            }, { transaction: t });
        }

        await product.decrement('stock', { by: quantity, transaction: t });
        await t.commit();

        res.status(201).json({ success: true, data: cartItem });
    } catch (err) {
        await t.rollback();
        next(err);
    }
};

const removeFromCart = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const cartItem = await CartItem.findByPk(req.params.id, {
            include: [{ model: Product }],
            transaction: t,
        });

        if (!cartItem) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        await cartItem.Product.increment('stock', { by: cartItem.quantity, transaction: t });
        await cartItem.destroy({ transaction: t });
        await t.commit();

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (err) {
        await t.rollback();
        next(err);
    }
};

module.exports = { getCart, addToCart, removeFromCart };