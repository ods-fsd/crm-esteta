const Client = require('../models/Client');
const {
    validateClient
} = require('../utils/validators');

// @desc    Отримати всіх клієнтів
// @route   GET /api/clients
const getClients = async (req, res) => {
    try {
        // .lean() суттєво пришвидшує запит
        const clients = await Client.find().sort({
            firstName: 1
        }).lean();
        res.json(clients);
    } catch (error) {
        res.status(500).json({
            error: 'Помилка отримання клієнтів'
        });
    }
};

// @desc    Створити нового клієнта
// @route   POST /api/clients
const createClient = async (req, res) => {
    // 1. Валідація Joi
    const {
        error
    } = validateClient(req.body);
    if (error) return res.status(400).json({
        error: error.details[0].message
    });

    try {
        const client = await Client.create(req.body);
        res.status(201).json(client);
    } catch (error) {
        // Обробка дублікату телефону (код помилки MongoDB 11000)
        if (error.code === 11000) {
            return res.status(400).json({
                error: 'Клієнт з таким телефоном вже існує'
            });
        }
        res.status(500).json({
            error: 'Server Error'
        });
    }
};

// @desc    Оновити клієнта
// @route   PUT /api/clients/:id
const updateClient = async (req, res) => {
    const {
        error
    } = validateClient(req.body);
    if (error) return res.status(400).json({
        error: error.details[0].message
    });

    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Повернути оновлений документ
            runValidators: true // Перевірити типи даних
        });

        if (!client) return res.status(404).json({
            error: 'Клієнта не знайдено'
        });
        res.json(client);
    } catch (error) {
        res.status(500).json({
            error: 'Server Error'
        });
    }
};

// @desc    Видалити клієнта
// @route   DELETE /api/clients/:id
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).json({
            error: 'Клієнта не знайдено'
        });
        res.json({
            message: 'Клієнта видалено'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server Error'
        });
    }
};

module.exports = {
    getClients,
    createClient,
    updateClient,
    deleteClient
};