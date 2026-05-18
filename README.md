Sistem Informasi Peminjaman Ruangan

Aplikasi berbasis web untuk manajemen dan pemantauan jadwal ketersediaan serta pengajuan peminjaman ruangan di lingkungan fakultas. Proyek ini dibangun menggunakan arsitektur **Model-View-Controller (MVC)** dengan **Node.js**, **ExpressJS**, dan **MySQL Native (Tanpa ORM)** sebagai pemenuhan Tugas Besar mata kuliah Pemrograman Web (Semester IV, Jurusan Sistem Informasi, Universitas Andalas).

🚀Fitur Utama Sistem

👤 Hak Akses: Pengguna (Mahasiswa/Dosen/Civitas)
* **Real-time Schedule:** Melihat jadwal ketersediaan ruangan secara langsung (*real-time*).
* **Form Pengajuan:** Mengisi formulir pengajuan peminjaman ruangan secara digital.
* **Tracking Status:** Memantau status dan riwayat pengajuan peminjaman secara *real-time*.
* **Unduh Bukti Awal:** Mengunduh bukti pengajuan awal dalam format PDF.
* **Unduh Surat Izin Resmi:** Mengunduh Surat Izin Peminjaman resmi dalam format PDF setelah disetujui.
* **Laporan Penggunaan:** Melaporkan penggunaan dengan menandai ruangan selesai digunakan.

💼 Hak Akses: Penanggung Jawab (Pimpinan/Admin Ruangan)
* **Dashboard Statistik:** Memantau statistik penggunaan ruangan melalui *dashboard* interaktif.
* **Manajemen Riwayat:** Menampilkan dan memperbarui data seluruh riwayat peminjaman.
* **Persetujuan & Catatan:** Menyetujui atau menolak pengajuan beserta fitur memberikan catatan alasan penolakan.
* **Verifikasi & Close Order:** Melakukan verifikasi akhir dan menutup (*close*) transaksi peminjaman secara permanen.
* **Rekap Laporan PDF:** Mengunduh rekap laporan peminjaman bulanan dan mengekspor riwayat berdasarkan filter ke dalam format PDF.

---

🛠️ Tech Stack yang Digunakan

* **Backend Framework:** ExpressJS (Node.js)
* **Template Engine (Frontend):** EJS (Embedded JavaScript) & Basecoat UI
* **Database Driver:** `mysql2` (Native Prepared Statements, No ORM)
* **Session Management:** `express-session` & `express-mysql-session`
* **Security:** `bcryptjs` (Password Hashing) & `dotenv` (Environment Variables)

---

📁 Struktur Folder Proyek

text
peminjaman-ruangan/
│
├── bin/                # Script untuk manajemen running server
├── config/             # Pengaturan koneksi database dan pool
├── controllers/        # Logika bisnis utama sistem
├── database/           # File kueri DDL / Skema SQL awal
├── middlewares/        # Satpam sistem (Autentikasi & ACL)
├── models/             # Kueri data model menggunakan Raw SQL murni
├── public/             # Aset statis frontend (CSS Basecoat, JS, Gambar)
├── routes/             # Pemetaan URL / Endpoint sistem
├── views/              # Halaman antarmuka pengguna (.ejs)
├── .env                # Variabel lingkungan rahasia (Local Database)
└── server.js           # Titik masuk utama aplikasi
