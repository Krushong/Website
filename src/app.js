require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const YandexStrategy = require('passport-yandex').Strategy;
const path = require('path');

const app = express();

// Настройка сессий
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Инициализация Passport
app.use(passport.initialize());
app.use(passport.session());

// Сериализация пользователя
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Настройка Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Настройка Yandex OAuth
passport.use(new YandexStrategy({
    clientID: process.env.YANDEX_CLIENT_ID,
    clientSecret: process.env.YANDEX_CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/auth/yandex/callback`
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Статические файлы
app.use(express.static('public'));

// Маршруты авторизации
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/index.html')
);

app.get('/auth/yandex',
    passport.authenticate('yandex')
);

app.get('/auth/yandex/callback',
    passport.authenticate('yandex', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/index.html')
);

// Главная страница
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/index.html');
    } else {
        res.sendFile(path.join(__dirname, '../public/views/authorization.html'));
    }
});

// Выход
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
}); 