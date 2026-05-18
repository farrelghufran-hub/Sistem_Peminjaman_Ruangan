/**
 * controllers/authController.js
 * Menangani proses registrasi, login, dan logout.
 */

const bcrypt = require('bcrypt');
const db     = require('../config/database');

const SALT_ROUNDS = 12;

// ─────────────────────────────────────────────
// Helper: validasi email sederhana
// ─────────────────────────────────────────────
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// ─────────────────────────────────────────────
// Helper: sanitasi string (trim & strip tag HTML dasar)
// ─────────────────────────────────────────────
const sanitize = (str) => {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
};

// ─────────────────────────────────────────────
// SHOW REGISTER — GET
// ─────────────────────────────────────────────
const showRegister = (req, res) => {
    return res.render('register', { error: null });
};

// ─────────────────────────────────────────────
// REGISTER — POST (FOTO PROFIL SUDAH DIHAPUS)
// ─────────────────────────────────────────────
const register = async (req, res) => {
    // Ambil sesuai atribut 'name' yang ada di register.ejs baru
    const nama_lengkap = sanitize(req.body.nama_lengkap || '');
    const email        = sanitize(req.body.email || '');
    const password     = req.body.password || '';  
    const konfirm      = req.body.konfirmasi_password || '';
    const role         = 'pengguna'; // default role

    // Validasi Sisi Server
    if (!nama_lengkap || nama_lengkap.length < 3) {
        return res.status(422).render('register', { error: 'Nama lengkap minimal 3 karakter.' });
    }
    if (!email || !isValidEmail(email)) {
        return res.status(422).render('register', { error: 'Format email tidak valid.' });
    }
    if (!password || password.length < 8) {
        return res.status(422).render('register', { error: 'Password minimal 8 karakter.' });
    }
    if (password !== konfirm) {
        return res.status(422).render('register', { error: 'Konfirmasi password tidak cocok.' });
    }

    try {
        // Cek apakah email sudah terdaftar (Sesuai schema.sql: kolom 'email' di tabel 'users')
        const [existing] = await db.execute(
            'SELECT user_id FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (existing.length > 0) {
            return res.status(422).render('register', { error: 'Email sudah terdaftar. Silakan gunakan email lain.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Generate ID unik string untuk user_id (karena di schema.sql tipe datanya VARCHAR)
        const newUserId = 'USR-' + Date.now() + '-' + Math.random().toString(16).slice(2, 6);

        // Simpan ke database (Sesuai dengan kolom di schema.sql Anda)
        await db.execute(
            `INSERT INTO users (user_id, nama_lengkap, email, password_hash, role)
             VALUES (?, ?, ?, ?, ?)`,
            [newUserId, nama_lengkap, email, hashedPassword, role]
        );

        req.session.flashSuccess = 'Registrasi berhasil! Silakan login.';
        return res.redirect('/auth/login');

    } catch (err) {
        console.error('[authController.register] Error:', err);
        return res.status(500).render('register', { error: 'Terjadi kesalahan server saat registrasi.' });
    }
};

// ─────────────────────────────────────────────
// SHOW LOGIN — GET
// ─────────────────────────────────────────────
const showLogin = (req, res) => {
    return res.render('login', { error: null });
};

// ─────────────────────────────────────────────
// LOGIN — POST (PERBAIKAN REDIRECT)
// ─────────────────────────────────────────────
const login = async (req, res) => {
    const email    = sanitize(req.body.email || '');
    const password = req.body.password || '';

    if (!email || !password) {
        return res.status(422).render('login', { error: 'Email dan password wajib diisi.' });
    }

    try {
        // KUNCI UTAMA: Ambil kolom sesuai dengan schema.sql Anda
        const [rows] = await db.execute(
            'SELECT user_id, nama_lengkap, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).render('login', { error: 'Email atau password salah.' });
        }

        const user = rows[0];

        // Verifikasi password (membandingkan dengan password_hash dari DB)
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).render('login', { error: 'Email atau password salah.' });
        }

        // Simpan data ke session
        req.session.regenerate((err) => {
            if (err) {
                console.error('[authController.login] Session error:', err);
                return res.status(500).render('login', { error: 'Terjadi kesalahan sistem session.' });
            }

            // Data user disimpan ke session untuk dibaca di middleware & views
            req.session.user = {
                id   : user.user_id,
                nama : user.nama_lengkap, // disimpan sebagai properti .nama agar klop dengan <%= user.nama %> di dashboard
                email: user.email,
                role : user.role,
            };

            // Redirect ke halaman asal jika ada, jika tidak, arahkan sesuai role
            const returnTo = req.session.returnTo || null;
            delete req.session.returnTo;

            if (returnTo) {
                return res.redirect(returnTo);
            }

            if (user.role === 'penanggung_jawab') {
                return res.redirect('/admin/dashboard');
            }

            return res.redirect('/dashboard');
        });

    } catch (err) {
        console.error('[authController.login] Error:', err);
        return res.status(500).render('login', { error: 'Terjadi kesalahan internal server saat login.' });
    }
};

// ─────────────────────────────────────────────
// LOGOUT — POST
// ─────────────────────────────────────────────
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('[authController.logout] Error:', err);
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        return res.redirect('/auth/login');
    });
};

module.exports = {
    showRegister,
    register,
    showLogin,
    login,
    logout,
};