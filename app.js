const express = require('express');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parser body bertipe JSON
app.use(express.urlencoded({ extended: true })); // Parser form-url-encoded

// Routing API
app.use('/api/items', itemRoutes);

// Fallback Route (404)
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Jalankan server hanya jika file ini dijalankan langsung (bukan saat dipanggil oleh module testing)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(` Inventory API running on port ${PORT} `);
        console.log(` URL: http://localhost:${PORT}/api/items `);
        console.log(`=========================================`);
    });
}

module.exports = app;