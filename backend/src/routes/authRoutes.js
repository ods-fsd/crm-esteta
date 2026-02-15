const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser
} = require('../controllers/authController');
const {
    protect
} = require('../middleware/authMiddleware');

// Публічні маршрути
router.post('/register', registerUser);
router.post('/login', loginUser);

// Приклад захищеного маршруту (для перевірки токена на фронтенді)
router.get('/me', protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;