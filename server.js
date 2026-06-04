const express        = require('express');
const session        = require('express-session');
const path           = require('path');
const multer         = require('multer');
const { v4: uuidv4 } = require('uuid'); // Taruh di atas bareng const lain

require('dotenv').config();

// Koneksi Database & Model (Langsung tarik Modelnya ke sini)
const db = require('./config/database');
const RuanganModel = require('./models/ruanganModel');
const BookingModel = require('./models/bookingModel');

// Import Middleware & Auth Controller (Ini aman karena udah jalan dari awal)
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
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads/surat'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use((req, res, next) => {
    res.locals.user         = req.session.user || null;
    res.locals.flashSuccess = req.session.flashSuccess || null;
    res.locals.flashError   = req.session.flashError   || null;
    delete req.session.flashSuccess;
    delete req.session.flashError;
    next();
});

// ================= ROUTES =================
app.get('/', (req, res) => res.redirect('/auth/login'));

app.get('/auth/login', isGuest, authController.showLogin);
app.post('/auth/login', isGuest, authController.login);
app.get('/auth/register', isGuest, authController.showRegister);
app.post('/auth/register', isGuest, authController.register);
app.post('/auth/logout', isAuthenticated, authController.logout);

// --- JALUR BRUTAL: Logika Controller Langsung Ditanam di Sini ---

// 1. Dashboard (Ganti bagian ini)
app.get('/dashboard', isAuthenticated, isAnyRole, async (req, res) => {
    console.log("MASUK KE DASHBOARD!");
    try {
        const daftarRuangan = await RuanganModel.getAllRuangan();
        console.log("Data ruangan yang ditarik:", daftarRuangan); // CEK INI DI TERMINAL
        res.render('dashboard', { ruangan: daftarRuangan });
    } catch (error) {
        console.error('Laporan Error Brutal:', error); // PASTIIN INI MUNCUL
        res.status(500).send('Detail Error: ' + error.message); // BIAR MUNCUL DI BROWSER
    }
});
// 2. Daftar Ruangan
app.get('/rooms', isAuthenticated, isAnyRole, async (req, res) => {
    try {
        const daftarRuangan = await RuanganModel.getAllRuangan();
        res.render('rooms', { ruangan: daftarRuangan });
    } catch (error) {
        res.redirect('/dashboard');
    }
});

// 3. Form Booking
// Ganti bagian rute /bookings/add dengan ini:
// Ganti rute /bookings/add jadi kayak gini di server.js
app.get('/bookings/add', isAuthenticated, isAnyRole, async (req, res) => {
    try {
        const daftarRuangan = await RuanganModel.getAllRuangan();
        const selectedRoom = req.query.room || '';
        
        // Ini kuncinya: kita render file .ejs, bukan res.send teks!
        res.render('add-booking', { ruangan: daftarRuangan, selectedRoom });
        
    } catch (error) {
        console.error("Gagal memuat form:", error);
        res.redirect('/rooms');
    }
});
// 4. Proses Submit Booking
// Hapus isAuthenticated, isAnyRole sementara
// HAPUS "isAuthenticated, isAnyRole," dari dalam kurung itu
// 4. Proses Submit Booking
app.post('/bookings/add', isAuthenticated, isAnyRole, upload.single('surat_pengajuan'), async (req, res) => {
    try {
        console.log("Mulai insert...");
        const { ruangan_id, tanggal_kegiatan, jam_mulai, jam_selesai, keterangan_kegiatan } = req.body;
        
        // 1. Generate ID Unik
        const bookingId = uuidv4(); 
        const userId = req.session.user?.user_id || req.session.user?.id;
        const filename = req.file ? req.file.filename : null;

        // 2. Tambahkan booking_id ke dalam SQL
        const sql = `INSERT INTO bookings (booking_id, user_id, room_id, tanggal_pinjam, jam_mulai, jam_selesai, keperluan, surat_izin) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        // 3. Eksekusi dengan menyertakan bookingId
        const [result] = await db.execute(sql, [
            bookingId, // <--- ID BARU MASUK DI SINI
            userId || null, 
            ruangan_id || null, 
            tanggal_kegiatan || null, 
            jam_mulai || null, 
            jam_selesai || null, 
            keterangan_kegiatan || null, 
            filename
        ]);

        console.log("HASIL INSERT:", result);
        return res.redirect('/dashboard');

    } catch (err) {
        console.error("ERROR DATABASE:", err);
        return res.status(500).send("Database Error: " + err.message);
    }
}); // <--- INI PENUTUP TRY-CATCH DAN APP.POST YANG BENAR
// 5. Riwayat (Sementara)
app.get('/bookings/my', isAuthenticated, isAnyRole, (req, res) => {
    res.send("<h1>Halaman Riwayat Belum Dibikin</h1><a href='/dashboard'>Kembali ke Dashboard</a>");
});

// Admin Route
//app.get('/admin/dashboard', isAuthenticated, isPenanggungJawab, (req, res) => {
    //res.render('admin/dashboard'); 
//});

// ================= ERROR HANDLERS =================
app.use((req, res) => {
    res.status(404).render('error', { statusCode: 404, message: 'Halaman tidak ditemukan.' });
});

app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 SERVER JALAN DI PORT ${PORT}`);
    console.log(`👉 Akses di: http://localhost:${PORT}`); // Tambahkan baris ini
    console.log(`======================================\n`);
});

