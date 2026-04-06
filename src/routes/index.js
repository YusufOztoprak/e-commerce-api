const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the E-commerce API v1' });
});

module.exports = router;