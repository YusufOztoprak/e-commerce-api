const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { getAllCategories, createCategory } = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.post('/', authenticate, authorize('admin'), createCategory);

module.exports = router;