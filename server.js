const express = require('express');
require('dotenv').config();
require('./config/database'); 

const authController = require('./controllers/authController');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// --- ROUTES GET (Tampilan Halaman) ---
app.get('/', (req, res) => res.render('login'));
app.get('/auth/login', (req, res) => res.render('login'));
app.get('/auth/register', (req, res) => res.render('register'));
app.get('/dashboard', (req, res) => res.render('dashboard')); 

// --- ROUTES POST (Proses Data Form) ---
app.post('/auth/register', authController.registerProses);
app.post('/auth/login', authController.loginProses); 

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});