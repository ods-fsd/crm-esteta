const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {
    validateUser
} = require('../utils/validators');

// Генерація JWT токена
const generateToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Токен живе 30 днів (зручно для адмінів)
    });
};

// @desc    Авторизація користувача
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    // 1. Пошук користувача
    const user = await User.findOne({
        username
    });

    // 2. Перевірка пароля (метод моделі)
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            permissions: user.permissions,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({
            error: 'Невірний логін або пароль'
        });
    }
};

// @desc    Реєстрація (тільки для першого запуску або super-admin)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const {
        error
    } = validateUser(req.body);
    if (error) return res.status(400).json({
        error: error.details[0].message
    });

    const {
        username,
        password,
        role
    } = req.body;

    const userExists = await User.findOne({
        username
    });
    if (userExists) {
        return res.status(400).json({
            error: 'Користувач вже існує'
        });
    }

    const user = await User.create({
        username,
        passwordHash: password, // Middleware саме захешує це поле
        role
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({
            error: 'Невірні дані користувача'
        });
    }
};

module.exports = {
    loginUser,
    registerUser
};