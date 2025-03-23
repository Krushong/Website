const express = require('express');
const router = express.Router();
const path = require('path');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '../../public/views/index.html'));
    } else {
        res.redirect('/auth');
    }
});

module.exports = router; 