const express = require('express');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 3000;

// Gunakan middleware logger request
app.use(requestLogger);

app.get('/', (req, res) => {
  logger.debug('Menghandle rute root (/)');
  res.send('Logger Module Express Berhasil Dijalankan!');
});

app.get('/error', (req, res) => {
  logger.error('Ini adalah simulasi log error');
  res.status(500).send('Terjadi Kesalahan!');
});

app.get('/warning', (req, res) => {
  logger.warn('Ini adalah simulasi log warning');
  res.status(400).send('Peringatan: Request Kurang Tepat!');
});

app.listen(PORT, () => {
  logger.info(`Server berjalan di port ${PORT} dalam mode ${process.env.NODE_ENV || 'production'}`);
});