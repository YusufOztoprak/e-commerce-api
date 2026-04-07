const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the E-commerce API v1' });
});

router.use('/auth', authRoutes);

module.exports = router;