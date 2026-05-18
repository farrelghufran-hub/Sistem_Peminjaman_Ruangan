-- database/migrations/001_create_users_table.sql
-- Jalankan sekali saat setup awal database

CREATE TABLE IF NOT EXISTS users (
    id           INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama         VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,                             -- bcrypt hash
    role         ENUM('pengguna', 'penanggung_jawab')
                              NOT NULL DEFAULT 'pengguna',
    foto_profil  VARCHAR(255) NULL DEFAULT NULL,                   -- nama file unik
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Contoh: buat akun Penanggung Jawab pertama (seed)
-- Ganti password hash di bawah ini dengan hasil bcrypt.hash()
-- Contoh: bcrypt.hash('Admin123!', 12) => hash yang ditempel di sini
-- ─────────────────────────────────────────────────────────────
-- INSERT INTO users (nama, email, password, role) VALUES
-- ('Admin Utama', 'admin@example.com', '$2b$12$HASH_DISINI', 'penanggung_jawab');
