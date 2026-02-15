const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['super-admin', 'admin', 'statistic'],
        default: 'admin'
    },
    // Для керування правами доступу до звітів (якщо ти super-admin)
    permissions: {
        reports: {
            type: [String], // Масив ключів дозволених звітів
            default: []
        }
    }
}, {
    timestamps: true
});

// Middleware Mongoose: Хешуємо пароль перед збереженням, якщо він був змінений
userSchema.pre('save', async function() {
    if (!this.isModified('passwordHash')) return;

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Метод для перевірки пароля
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);