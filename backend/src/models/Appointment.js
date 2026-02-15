const mongoose = require('mongoose');

// Підсхема для послуги (не окрема модель, а частина запису)
const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    note: {
        type: String,
        default: ''
    }
}, {
    _id: false
}); // _id тут не потрібен, економимо пам'ять

const appointmentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Зв'язок з моделлю Client
        required: true,
        index: true // Для швидкого пошуку історії клієнта
    },
    appointmentDateTime: {
        type: Date,
        required: true,
        index: true // Для швидкого відображення календаря
    },
    services: [serviceSchema], // Вкладений масив послуг
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'], // Тільки ці значення
        default: 'scheduled',
        index: true // Для звітів
    },
    adminNote: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);