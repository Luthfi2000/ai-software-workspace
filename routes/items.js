const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Menggunakan file JSON test khusus jika berada di environment pengujian (test)
const dataPath = process.env.NODE_ENV === 'test'
    ? path.join(__dirname, '../data/items.test.json')
    : path.join(__dirname, '../data/items.json');

// Helper function untuk membaca data dari JSON
async function readData() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper function untuk menulis data ke JSON
async function writeData(data) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// 1. GET ALL ITEMS
router.get('/', async (req, res) => {
    try {
        const items = await readData();
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data' });
    }
});

// 2. GET ITEM BY ID
router.get('/:id', async (req, res) => {
    try {
        const items = await readData();
        const item = items.find(i => i.id === parseInt(req.params.id));
        
        if (!item) {
            return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
        }
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
});

// 3. CREATE ITEM (POST)
router.post('/', async (req, res) => {
    try {
        const { name, qty, price } = req.body;
        
        if (!name || qty === undefined || price === undefined) {
            return res.status(400).json({ success: false, message: 'Input tidak lengkap (name, qty, price wajib diisi)' });
        }

        const items = await readData();
        const newItem = {
            id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
            name,
            qty: parseInt(qty),
            price: parseFloat(price)
        };

        items.push(newItem);
        await writeData(items);

        res.status(201).json({ success: true, message: 'Barang berhasil ditambahkan', data: newItem });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambahkan barang' });
    }
});

// 4. UPDATE ITEM (PUT)
router.put('/:id', async (req, res) => {
    try {
        const { name, qty, price } = req.body;
        const items = await readData();
        const index = items.findIndex(i => i.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
        }

        // Update field jika dikirimkan di body
        if (name !== undefined) items[index].name = name;
        if (qty !== undefined) items[index].qty = parseInt(qty);
        if (price !== undefined) items[index].price = parseFloat(price);

        await writeData(items);
        res.json({ success: true, message: 'Barang berhasil diperbarui', data: items[index] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui barang' });
    }
});

// 5. DELETE ITEM
router.delete('/:id', async (req, res) => {
    try {
        const items = await readData();
        const index = items.findIndex(i => i.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
        }

        const deletedItem = items.splice(index, 1);
        await writeData(items);

        res.json({ success: true, message: 'Barang berhasil dihapus', data: deletedItem[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus barang' });
    }
});

module.exports = router;