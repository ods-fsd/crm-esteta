require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

// Ініціалізація
const app = express();
const PORT = process.env.PORT || 5000;

// Підключення до БД
connectDB();

// ... (імпорти зверху залишаються: express, cors, helmet, morgan, connectDB)

// --- ДОДАЙ ЦІ ІМПОРТИ ---
const authRoutes = require('./src/routes/authRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

// ... (ініціалізація app, connectDB... залишаються)

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// --- ПІДКЛЮЧЕННЯ МАРШРУТІВ (Це нове) ---
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);

// Базовий роут
app.get('/', (req, res) => {
    res.send('API CRM Esteta v2 is running...');
});

// Глобальна обробка помилок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Server Error',
        details: err.message
    });
});

app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
});