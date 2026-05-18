const bcrypt = require('bcryptjs'); 
const UserModel = require('../models/userModel');

const authController = {
    // Fungsi Register
    registerProses: async (req, res) => {
        const { nama_lengkap, email, password, konfirmasi_password } = req.body;

        if (password !== konfirmasi_password) {
            return res.render('register', { error: 'Password dan Konfirmasi tidak cocok!' });
        }

        try {
            const cekUser = await UserModel.findUserByEmail(email);
            // Penyesuaian pengecekan data balikan dari database
            let userExists = false;
            if (Array.isArray(cekUser) && Array.isArray(cekUser[0]) && cekUser[0].length > 0) userExists = true;
            else if (Array.isArray(cekUser) && cekUser.length > 0 && !Array.isArray(cekUser[0])) userExists = true;
            else if (cekUser && !Array.isArray(cekUser)) userExists = true;

            if (userExists) {
                return res.render('register', { error: 'Email sudah terdaftar, silakan login!' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await UserModel.createUser(nama_lengkap, email, hashedPassword);
            res.redirect('/auth/login');

        } catch (error) {
            console.error('Error saat register:', error);
            res.render('register', { error: 'Sistem sedang gangguan, coba lagi nanti.' });
        }
    },

    // Fungsi Login
   // Fungsi Login
    loginProses: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Karena di userModel lu udah pakai `return rows[0]`, datanya udah rapi!
            const user = await UserModel.findUserByEmail(email);

            if (!user) {
                return res.render('login', { error: 'Email tidak ditemukan, silakan daftar dulu.' });
            }

            // PERBAIKAN DI SINI: Ganti user.password jadi user.password_hash
            const passwordCocok = await bcrypt.compare(password, user.password_hash);
            
            if (!passwordCocok) {
                return res.render('login', { error: 'Password salah, silakan coba lagi.' });
            }

            res.redirect('/dashboard');

        } catch (error) {
            console.error('Error saat login:', error);
            res.render('login', { error: 'Sistem sedang gangguan, coba lagi nanti.' });
        }
    }
};

module.exports = authController;