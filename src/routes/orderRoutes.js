const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { createOrder, getOrders } = require('../controllers/orderController');

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);

module.exports = router;