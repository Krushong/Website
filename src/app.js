require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');

const app = express();

// Настройка статических файлов
app.use(express.static(path.join(__dirname, '../public')));

// Настройка сессий
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));

// Инициализация Passport
app.use(passport.initialize());
app.use(passport.session());

// Подключение маршрутов
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/logout', authRoutes); // Добавляем маршрут для logout

// Запуск сервера
app.listen(process.env.PORT, () => {
    console.log(`Сервер запущен на http://localhost:${process.env.PORT}`);
}); 