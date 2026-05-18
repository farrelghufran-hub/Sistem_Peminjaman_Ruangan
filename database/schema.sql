CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('pengguna', 'penanggung_jawab', 'admin') DEFAULT 'pengguna',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_ruangan VARCHAR(100) NOT NULL,
    kapasitas INT NOT NULL,
    fasilitas TEXT,
    foto_ruangan VARCHAR(255), -- Nyimpen nama/path file foto hasil upload
    status_aktif BOOLEAN DEFAULT TRUE, -- Biar admin bisa non-aktifkan ruangan kalau lagi direnovasi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    booking_id VARCHAR(50) PRIMARY KEY, -- Pakai UUID kayak tabel users
    user_id VARCHAR(50) NOT NULL,
    room_id INT NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    keperluan TEXT NOT NULL,
    surat_izin VARCHAR(255), -- Nyimpen file PDF/Gambar KTM yang diupload pengguna
    status ENUM('pending', 'disetujui', 'ditolak', 'dibatalkan', 'selesai') DEFAULT 'pending',
    catatan_penolakan TEXT, -- Kepake buat fitur PJ ngasih alasan nolak
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Ini relasinya ngab, biar datanya valid dan nggak ada ghost data
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);