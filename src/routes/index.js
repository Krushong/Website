const express = require('express');
const router = express.Router();
const path = require('path');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, (req, res) => {
    res.sendFile('views/index.html', { root: path.join(__dirname, '../public') });
});

router.get('/slideshow.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/slideshow.html'));
});

module.exports = router; 