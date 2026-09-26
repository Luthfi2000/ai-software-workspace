const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Menggunakan logger yang sudah ada

const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;

  if (!dbUri) {
    logger.error('MONGODB_URI tidak didefinisikan di variabel lingkungan (.env)');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(dbUri, {
      // Opsi konfigurasi default mongoose 8.x sudah optimal secara default,
      // namun kita bisa menambahkan kustomisasi jika diperlukan di sini.
    });

    logger.info(`MongoDB Terkoneksi: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error Koneksi Database: ${error.message}`);
    process.exit(1);
  }

  // Monitor perubahan status koneksi
  mongoose.connection.on('disconnected', () => {
    logger.warn('Koneksi MongoDB terputus!');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`Error pada koneksi MongoDB: ${err}`);
  });
};

// Penanganan Graceful Shutdown
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Koneksi MongoDB ditutup secara aman.');
  } catch (err) {
    logger.error(`Gagal menutup koneksi MongoDB: ${err.message}`);
  }
};

module.exports = { connectDB, closeDB };