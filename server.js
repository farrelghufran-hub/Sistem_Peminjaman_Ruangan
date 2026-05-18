const express = require('express');
require('dotenv').config();

require('./config/database');

const app = express();
const PORT = 3000;

// Setup EJS sebagai template engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('.'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route utama
app.get('/', (req, res) => {
    res.send('Server Peminjaman Ruangan Jalan!');
});

// Route Login
app.get('/auth/login', (req, res) => {
    res.render('login');
});

// Route Register
app.get('/auth/register', (req, res) => {
    res.render('register');
});

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});