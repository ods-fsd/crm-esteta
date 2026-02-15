const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Перевірка: чи залогінений користувач
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Отримуємо токен з заголовка "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Розшифровуємо
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Знаходимо користувача, але беремо тільки потрібні поля (select)
            req.user = await User.findById(decoded.id).select('-passwordHash');

            if (!req.user) {
                return res.status(401).json({
                    error: 'Користувача не знайдено'
                });
            }

            next();
        } catch (error) {
            console.error('[Auth Error]', error.message);
            res.status(401).json({
                error: 'Не авторизовано, токен невірний'
            });
        }
    } else {
        res.status(401).json({
            error: 'Не авторизовано, немає токена'
        });
    }
};

// 2. Перевірка: чи є у користувача права (Role-Based Access Control)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Користувач не авторизований'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Роль ${req.user.role} не має доступу до цього ресурсу`
            });
        }
        next();
    };
};

module.exports = {
    protect,
    authorize
};