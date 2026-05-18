/**
 * aclMiddleware.js
 * Middleware Access Control List (ACL).
 * Mengecek role user sebelum mengizinkan akses ke rute tertentu.
 *
 * Role yang tersedia:
 *   - 'pengguna'          → user biasa
 *   - 'penanggung_jawab'  → admin / pengelola ruangan
 */

/**
 * Factory function: buat middleware yang hanya mengizinkan role tertentu.
 *
 * Contoh penggunaan:
 *   router.get('/admin/dashboard', isAuthenticated, authorizeRole('penanggung_jawab'), handler);
 *   router.get('/booking',         isAuthenticated, authorizeRole('pengguna', 'penanggung_jawab'), handler);
 *
 * @param  {...string} allowedRoles  Role yang diizinkan mengakses rute
 * @returns {Function} Express middleware
 */
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Pastikan session dan data user ada
        if (!req.session || !req.session.user) {
            return res.redirect('/auth/login');
        }

        const userRole = req.session.user.role;

        if (!allowedRoles.includes(userRole)) {
            // Role tidak memiliki akses — tampilkan halaman 403
            return res.status(403).render('error', {
                statusCode: 403,
                message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.',
            });
        }

        return next();
    };
};

/**
 * Shorthand: hanya Penanggung Jawab (admin) yang boleh akses.
 */
const isPenanggungJawab = authorizeRole('penanggung_jawab');

/**
 * Shorthand: hanya Pengguna biasa yang boleh akses.
 */
const isPengguna = authorizeRole('pengguna');

/**
 * Shorthand: kedua role boleh akses (tapi tetap harus login).
 */
const isAnyRole = authorizeRole('pengguna', 'penanggung_jawab');

module.exports = {
    authorizeRole,
    isPenanggungJawab,
    isPengguna,
    isAnyRole,
};
