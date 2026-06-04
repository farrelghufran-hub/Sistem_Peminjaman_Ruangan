const db = require('../config/database');

const RuanganModel = {
    // Pastikan ini ada dan penulisan hurufnya pas (Case Sensitive!)
    getAllRuangan: async () => {
        try {
            // Sesuaikan nama tabel 'ruangan' dengan database lu
            const [rows] = await db.query('SELECT * FROM ruangan');
            return rows;
        } catch (error) {
            console.error('Error di Model:', error);
            throw error;
        }
    }
};

// INI YANG PALING PENTING: Harus ada export-nya!
module.exports = RuanganModel;