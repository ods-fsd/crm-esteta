const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true, // Запобігає дублям номерів
        index: true, // Пришвидшує пошук в 100 разів
        trim: true
    },
    birthDate: {
        type: Date,
        default: null
    },
    socialMediaLink: {
        type: String,
        default: ''
    },
    // Поле для оптимізації: ми будемо оновлювати його при кожному записі,
    // щоб не шукати останній запис через складні запити.
    lastVisit: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Автоматично створює createdAt та updatedAt
});

module.exports = mongoose.model('Client', clientSchema);