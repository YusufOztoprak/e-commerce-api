const Joi = require('joi');

const addToCartSchema = Joi.object({
    product_id: Joi.string().uuid().required().messages({
        'string.uuid': 'product_id must be a valid UUID',
        'any.required': 'product_id is required',
    }),
    quantity: Joi.number().integer().min(1).default(1).messages({
        'number.min': 'quantity must be at least 1',
        'number.integer': 'quantity must be an integer',
    }),
});

module.exports = { addToCartSchema };