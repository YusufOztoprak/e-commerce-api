const { Category } = require('../models');

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.json({ success: true, data: categories });
    } catch (err) {
        next(err);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const existing = await Category.findOne({ where: { name } });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Category already exists' });
        }
        const category = await Category.create({ name, description });
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllCategories, createCategory };