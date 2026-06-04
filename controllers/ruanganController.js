const RuanganModel = require('../models/ruanganModel');

const ruanganController = {
    index: async (req, res) => {
        try {
            const daftarRuangan = await RuanganModel.getAllRuangan();
            res.render('rooms', { ruangan: daftarRuangan });
        } catch (error) {
            console.error('Error muat daftar ruangan:', error);
            req.session.flashError = ['Gagal memuat data ruangan.'];
            res.redirect('/dashboard');
        }
    }
};

module.exports = ruanganController;