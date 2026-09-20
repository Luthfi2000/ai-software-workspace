const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const app = require('../app');

const testDataPath = path.join(__dirname, '../data/items.test.json');

const initialMockData = [
  {
    "id": 1,
    "name": "Laptop ThinkPad L13 Test",
    "qty": 5,
    "price": 12000000
  }
];

// Setup data test sebelum setiap pengujian
beforeEach(async () => {
    await fs.writeFile(testDataPath, JSON.stringify(initialMockData, null, 2), 'utf8');
});

// Cleanup file data test setelah semua pengujian selesai
afterAll(async () => {
    try {
        await fs.unlink(testDataPath);
    } catch (err) {
        // Abaikan jika file tidak ditemukan
    }
});

describe('Inventory REST API Endpoints', () => {
    
    test('GET /api/items - Harus mendapatkan semua data barang', async () => {
        const res = await request(app).get('/api/items');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(1);
    });

    test('GET /api/items/:id - Harus mengembalikan detail satu barang jika ID ditemukan', async () => {
        const res = await request(app).get('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe("Laptop ThinkPad L13 Test");
    });

    test('GET /api/items/:id - Harus mengembalikan status 404 jika ID tidak ada', async () => {
        const res = await request(app).get('/api/items/99');
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });

    test('POST /api/items - Harus sukses membuat data barang baru', async () => {
        const newItem = {
            name: "Mechanical Keyboard",
            qty: 10,
            price: 750000
        };
        const res = await request(app)
            .post('/api/items')
            .send(newItem);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(2);
        expect(res.body.data.name).toBe("Mechanical Keyboard");
    });

    test('POST /api/items - Harus gagal jika data body tidak lengkap', async () => {
        const res = await request(app)
            .post('/api/items')
            .send({ name: "Incorrect Item" }); // Tanpa qty dan price

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('PUT /api/items/:id - Harus sukses memperbarui field barang', async () => {
        const updateData = { qty: 25 };
        const res = await request(app)
            .put('/api/items/1')
            .send(updateData);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.qty).toBe(25);
    });

    test('DELETE /api/items/:id - Harus sukses menghapus barang', async () => {
        const res = await request(app).delete('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(1);

        // Pastikan kembali kosong saat dipanggil lagi
        const checkRes = await request(app).get('/api/items');
        expect(checkRes.body.data.length).toBe(0);
    });
});