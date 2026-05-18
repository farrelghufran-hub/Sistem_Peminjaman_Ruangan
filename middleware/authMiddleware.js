/**
 * authMiddleware.js
 * Middleware untuk mengecek apakah user sudah login (session aktif).
 * Jika belum login, redirect ke halaman login.
 */

/**
 * Pastikan user sudah terautentikasi.
 * Digunakan sebagai middleware di rute yang butuh login.
 */
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        // Session ada dan valid, lanjut
        return next();
    }

    // Belum login — redirect ke halaman login
    req.session.returnTo = req.originalUrl; // simpan URL tujuan agar bisa redirect balik setelah login
    return res.redirect('/auth/login');
};

/**
 * Pastikan user BELUM login.
 * Digunakan di rute /auth/login dan /auth/register
 * agar user yang sudah login tidak bisa mengakses halaman tersebut.
 */
const isGuest = (req, res, next) => {
    if (req.session && req.session.user) {
        // Sudah login, redirect ke dashboard sesuai role
        const role = req.session.user.role;
        if (role === 'penanggung_jawab') {
            return res.redirect('/admin/dashboard');
        }
        return res.redirect('/dashboard');
    }
    return next();
};

module.exports = { isAuthenticated, isGuest };
