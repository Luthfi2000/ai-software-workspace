require('dotenv').config();
const express = require('express');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const { connectDB, closeDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi Database
connectDB();

// Middleware
app.use(express.json());
app.use(requestLogger);

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

const server = app.listen(PORT, () => {
  logger.info(`Server berjalan di port ${PORT}`);
});

// Penanganan graceful shutdown untuk proses OS (SIGINT / SIGTERM)
const shutdown = async () => {
  logger.info('Menerima sinyal terminasi, mematikan server secara graceful...');
  server.close(async () => {
    logger.info('HTTP server ditutup.');
    await closeDB();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);