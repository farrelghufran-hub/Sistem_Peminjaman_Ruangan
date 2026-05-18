const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'peminjaman_ruangan',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ngetes koneksi jalan atau nggak
pool.getConnection()
    .then(conn => {
        console.log('Mantap! Database MySQL berhasil terhubung!');
        conn.release();
    })
    .catch(err => {
        console.error('Waduh, gagal nyambung ke database:', err.message);
    });

module.exports = pool;