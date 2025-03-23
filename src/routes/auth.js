const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, '../../public/views/authorization.html'));
    }
});

router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth' }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/yandex',
    passport.authenticate('yandex', {
        scope: ['login:info', 'login:email']
    }));

router.get('/yandex/callback',
    passport.authenticate('yandex', { 
        failureRedirect: '/auth',
        failureFlash: true
    }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/auth');
    });
});

module.exports = router; 