<<<<<<< HEAD
const express        = require('express');
const session        = require('express-session');
const path           = require('path');
const multer         = require('multer');
=======
const express = require('express');
>>>>>>> efb460ba898835f1859ed38c1d5362c153de5d78
require('dotenv').config();

require('./config/database');

<<<<<<< HEAD
const { isAuthenticated, isGuest }       = require('./middleware/authMiddleware');
const { isPenanggungJawab, isAnyRole }   = require('./middleware/aclMiddleware');
const authController                     = require('./controllers/authController');

const app  = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret           : process.env.SESSION_SECRET || 'ganti_dengan_secret_yang_kuat',
    resave           : false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,          // cegah akses via JavaScript
        secure  : process.env.NODE_ENV === 'production', // HTTPS only di production
        maxAge  : 1000 * 60 * 60 * 2,  // 2 jam
        sameSite: 'lax',
    },
}));

const uploadTemp = multer({
    dest   : path.join(__dirname, 'public/uploads/temp'),
    limits : { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

app.use((req, res, next) => {
    res.locals.user         = req.session.user || null;
    res.locals.flashSuccess = req.session.flashSuccess || null;
    res.locals.flashError   = req.session.flashError   || null;
    delete req.session.flashSuccess;
    delete req.session.flashError;
    next();
});

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.get ('/auth/login',    isGuest, authController.showLogin);
app.post('/auth/login',    isGuest, authController.login);

app.get ('/auth/register', isGuest, authController.showRegister);
app.post('/auth/register', isGuest, authController.register);

app.post('/auth/logout',   isAuthenticated, authController.logout);

app.get('/dashboard', isAuthenticated, isAnyRole, (req, res) => {
    res.render('dashboard'); // views/dashboard.ejs
});

app.get('/admin/dashboard', isAuthenticated, isPenanggungJawab, (req, res) => {
    res.render('admin/dashboard'); // views/admin/dashboard.ejs
});

app.use((req, res) => {
    res.status(404).render('error', {
        statusCode: 404,
        message   : 'Halaman tidak ditemukan.',
    });
});

app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
    console.error('[Global Error]', err);
    res.status(500).render('error', {
        statusCode: 500,
        message   : 'Terjadi kesalahan internal server.',
    });
=======
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
>>>>>>> efb460ba898835f1859ed38c1d5362c153de5d78
});

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> efb460ba898835f1859ed38c1d5362c153de5d78
