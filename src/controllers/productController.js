const { Product, Category } = require('../models');

const getAllProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, name, category_id } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (name) where.name = { [require('sequelize').Op.iLike]: `%${name}%` };
        if (category_id) where.category_id = category_id;

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [{ model: Category, attributes: ['id', 'name'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (err) {
        next(err);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Category, attributes: ['id', 'name'] }],
        });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, image_url, category_id } = req.body;

        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const product = await Product.create({
            name, description, price, stock, image_url, category_id,
        });

        res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.update(req.body);
        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.destroy();
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };