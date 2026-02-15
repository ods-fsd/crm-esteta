const Joi = require('joi');

// Валідатор для створення/оновлення Клієнта
const validateClient = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required().messages({
            'string.empty': "Ім'я обов'язкове",
            'string.min': "Ім'я занадто коротке"
        }),
        lastName: Joi.string().min(2).max(50).required(),
        phoneNumber: Joi.string().pattern(/^[0-9+\-() ]{10,20}$/).required().messages({
            'string.pattern.base': "Невірний формат телефону"
        }),
        birthDate: Joi.date().allow(null, ''),
        socialMediaLink: Joi.string().allow('', null)
    });
    return schema.validate(data);
};

// Валідатор для Запису (Appointment)
const validateAppointment = (data) => {
    const serviceSchema = Joi.object({
        serviceName: Joi.string().required(),
        price: Joi.number().min(0).required(),
        note: Joi.string().allow('', null)
    });

    const schema = Joi.object({
        clientId: Joi.string().required(), // Перевіряємо, що це ID
        appointmentDateTime: Joi.date().required(),
        services: Joi.array().items(serviceSchema).min(1).required().messages({
            'array.min': "Має бути обрана хоча б одна послуга"
        }),
        adminNote: Joi.string().allow('', null),
        status: Joi.string().valid('scheduled', 'completed', 'cancelled')
    });

    return schema.validate(data);
};

// Валідатор для Реєстрації/Логіна
const validateUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('super-admin', 'admin', 'statistic')
    });
    return schema.validate(data);
}

module.exports = {
    validateClient,
    validateAppointment,
    validateUser
};