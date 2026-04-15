const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { addToCartSchema } = require('../validators/cartValidator');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/', authenticate, getCart);
router.post('/items', authenticate, validate(addToCartSchema), addToCart);
router.delete('/items/:id', authenticate, removeFromCart);

module.exports = router;