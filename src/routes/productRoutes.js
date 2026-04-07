const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

// Public route to get all products
router.get('/', getAllProducts);

// Public route to get a product by ID
router.get('/:id', getProductById);

// Protected route to create a new product (admin only)
router.post('/', authenticate, authorize('admin'), createProduct);

// Protected route to update a product (admin only)
router.put('/:id', authenticate, authorize('admin'), updateProduct);

// Protected route to delete a product (admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router;