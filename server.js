const express = require('express');
require('dotenv').config();

// Panggil koneksi database lu biar langsung ngetes pas server nyala
require('./config/database'); 

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Peminjaman Ruangan Jalan Ngab!');
});

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});