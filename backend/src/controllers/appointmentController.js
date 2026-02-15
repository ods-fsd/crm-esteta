const Appointment = require('../models/Appointment');
const Client = require('../models/Client');
const {
    validateAppointment
} = require('../utils/validators');

// @desc    Отримати всі записи
// @route   GET /api/appointments
const getAppointments = async (req, res) => {
    try {
        // populate('client') підтягує дані клієнта (ім'я, телефон) в об'єкт запису
        const appointments = await Appointment.find()
            .populate('client', 'firstName lastName phoneNumber')
            .sort({
                appointmentDateTime: -1
            }) // Від нових до старих
            .lean();

        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Помилка завантаження записів'
        });
    }
};

// @desc    Створити запис
// @route   POST /api/appointments
const createAppointment = async (req, res) => {
    const {
        error
    } = validateAppointment(req.body);
    if (error) return res.status(400).json({
        error: error.details[0].message
    });

    const {
        clientId,
        appointmentDateTime,
        services,
        adminNote
    } = req.body;

    try {
        // 1. Рахуємо суму на бекенді (безпека)
        const totalPrice = services.reduce((sum, item) => sum + Number(item.price), 0);

        // 2. Створюємо запис
        const appointment = await Appointment.create({
            client: clientId,
            appointmentDateTime,
            services,
            totalPrice,
            adminNote,
            status: 'scheduled'
        });

        // 3. ОПТИМІЗАЦІЯ: Оновлюємо дату останнього візиту клієнта
        // Ми не чекаємо завершення (await), щоб віддати відповідь швидше
        Client.findByIdAndUpdate(clientId, {
            lastVisit: appointmentDateTime
        }).exec();

        // Повертаємо створений запис (можна зробити populate, якщо треба одразу відобразити ім'я)
        const populatedAppt = await appointment.populate('client', 'firstName lastName phoneNumber');

        res.status(201).json(populatedAppt);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Не вдалося створити запис'
        });
    }
};

// @desc    Оновити статус або дані запису
// @route   PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
    // Валідація тут може бути частковою, але для простоти перевіряємо основні поля
    const {
        services
    } = req.body;

    try {
        // Якщо оновлюються послуги, перерахувати суму
        if (services) {
            req.body.totalPrice = services.reduce((sum, item) => sum + Number(item.price), 0);
        }

        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }).populate('client', 'firstName lastName phoneNumber');

        if (!appointment) return res.status(404).json({
            error: 'Запис не знайдено'
        });

        res.json(appointment);
    } catch (error) {
        res.status(500).json({
            error: 'Server Error'
        });
    }
};

// @desc    Видалити запис
// @route   DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) return res.status(404).json({
            error: 'Запис не знайдено'
        });
        res.json({
            message: 'Запис видалено'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server Error'
        });
    }
};

module.exports = {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
};