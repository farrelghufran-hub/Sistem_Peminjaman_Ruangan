const pool = require('../config/database');
const crypto = require('crypto');

const UserModel = {
    // Kueri buat daftar akun baru
    createUser: async (namaLengkap, email, passwordHash, role = 'pengguna') => {
        const userId = crypto.randomUUID(); 
        const query = `
            INSERT INTO users (user_id, nama_lengkap, email, password_hash, role)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        try {
            const [result] = await pool.execute(query, [userId, namaLengkap, email, passwordHash, role]);
            return { success: true, userId: userId };
        } catch (error) {
            console.error('Error di UserModel.createUser:', error);
            throw error;
        }
    },

    // Kueri buat login (Cari user dari email)
    findUserByEmail: async (email) => {
        const query = `
            SELECT user_id, nama_lengkap, email, password_hash, role 
            FROM users 
            WHERE email = ? 
            LIMIT 1
        `;
        
        try {
            const [rows] = await pool.execute(query, [email]);
            return rows[0]; 
        } catch (error) {
            console.error('Error di UserModel.findUserByEmail:', error);
            throw error;
        }
    }
};

module.exports = UserModel;