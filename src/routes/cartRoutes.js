const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/', authenticate, getCart);
router.post('/items', authenticate, addToCart);
router.delete('/items/:id', authenticate, removeFromCart);

module.exports = router;