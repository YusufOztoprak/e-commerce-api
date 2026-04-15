const Joi = require('joi');

const createProductSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(1000),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).default(0),
    image_url: Joi.string().uri(),
    category_id: Joi.string().uuid().required(),
});

const updateProductSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(1000),
    price: Joi.number().positive(),
    stock: Joi.number().integer().min(0),
    image_url: Joi.string().uri(),
    category_id: Joi.string().uuid(),
});

module.exports = { createProductSchema, updateProductSchema };