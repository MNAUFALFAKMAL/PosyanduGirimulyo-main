# Laporan Pengembangan Sistem Informasi Posyandu Girimulyo

Tanggal: 28 Juni 2026  
Status: Siap uji coba dan siap deploy hosting Node.js  
URL Demo: Belum ditentukan  
Lokasi Studi Kasus: Desa Girimulyo, Kecamatan Marga Sekampung, Kabupaten Lampung Timur

---

## Ringkasan Eksekutif

Pengembangan Sistem Informasi Posyandu Girimulyo dilakukan untuk menyediakan media digital yang membantu edukasi stunting, pemantauan status gizi anak, pencatatan histori pemeriksaan, serta pemisahan data antar lokasi Posyandu Plamboyan.

Sistem dibangun sebagai aplikasi web berbasis Next.js, React, Tailwind CSS, dan MariaDB. Aplikasi memiliki halaman informasi publik, halaman penyebab dan pencegahan stunting, halaman dampak stunting, login petugas, kalkulator status gizi anak, histori pemeriksaan, pencarian data, serta export laporan ke Excel.

Hasil akhir pengembangan adalah aplikasi web yang dapat digunakan oleh kader Posyandu untuk memasukkan data anak, menghitung status gizi berdasarkan indikator antropometri, menyimpan hasil ke database, memfilter histori berdasarkan bulan dan nama anak, serta mengunduh laporan dalam format Excel. Sistem juga mendukung 6 lokasi Posyandu Plamboyan dan satu akun pengelola untuk melihat seluruh data.

---

## 1. Pendahuluan

### 1.1 Latar Belakang

Posyandu memiliki peran penting dalam pemantauan tumbuh kembang anak, khususnya dalam upaya pencegahan stunting. Dalam pelaksanaan kegiatan Posyandu, data anak seperti nama, NIK, tanggal lahir, berat badan, tinggi badan, dan hasil pemeriksaan perlu dicatat dengan rapi agar perkembangan anak dapat dipantau dari waktu ke waktu.

Pada Desa Girimulyo terdapat beberapa lokasi Posyandu Plamboyan. Karena setiap lokasi memiliki data pemeriksaan masing-masing, sistem perlu memisahkan histori berdasarkan tempat Posyandu agar data lebih tertata dan tidak bercampur. Selain itu, petugas juga membutuhkan fitur rekap dan export laporan untuk kebutuhan administrasi.

Berdasarkan kebutuhan tersebut, dikembangkan aplikasi Sistem Informasi Posyandu Girimulyo yang berfungsi sebagai portal edukasi stunting sekaligus alat bantu pencatatan dan pengolahan data status gizi anak.

### 1.2 Tujuan Pengembangan

Tujuan pengembangan sistem ini adalah:

- Menyediakan website informasi tentang stunting yang mudah dipahami masyarakat.
- Menyediakan kalkulator status gizi anak untuk membantu pemantauan Posyandu.
- Menyimpan histori pemeriksaan anak ke database MariaDB.
- Memisahkan data pemeriksaan berdasarkan lokasi Plamboyan 1 sampai Plamboyan 6.
- Menyediakan akun pengelola yang dapat melihat seluruh data Posyandu.
- Menyediakan fitur pencarian histori berdasarkan nama anak.
- Menyediakan filter histori berdasarkan bulan.
- Menyediakan export laporan ke Excel dengan tabel yang rapi.
- Menyediakan tampilan web yang responsif, modern, dan mudah digunakan kader.

### 1.3 Manfaat Pengembangan

Manfaat bagi kader Posyandu:

- Mempermudah pencatatan hasil pemeriksaan anak.
- Mempermudah pemantauan histori pemeriksaan berdasarkan bulan.
- Mempermudah pencarian data anak berdasarkan nama.
- Mempermudah pembuatan laporan Excel.
- Mengurangi risiko data antar Posyandu tercampur.

Manfaat bagi pemerintah desa:

- Memiliki media digital untuk mendukung program pencegahan stunting.
- Memiliki rekap data pemeriksaan yang lebih tertata.
- Mempermudah koordinasi antar lokasi Posyandu.
- Mendukung administrasi kesehatan desa berbasis data.

Manfaat bagi masyarakat:

- Mendapatkan informasi tentang penyebab, dampak, dan pencegahan stunting.
- Mendapatkan layanan Posyandu yang lebih rapi dan terdokumentasi.
- Memudahkan pemantauan tumbuh kembang anak secara berkala.

### 1.4 Batasan Pengembangan

Pengembangan tahap ini memiliki batasan sebagai berikut:

- Sistem berfokus pada edukasi stunting, kalkulator gizi, histori pemeriksaan, dan laporan Excel.
- Akun login masih dikelola secara hardcoded di aplikasi.
- Sistem belum menggunakan manajemen user dari database.
- Kalkulator membantu pemantauan awal, bukan pengganti diagnosis tenaga kesehatan.
- Data standar antropometri berada di kode aplikasi dan perlu validasi lanjutan jika digunakan untuk operasional resmi jangka panjang.
- Hosting produksi direncanakan menggunakan layanan yang mendukung Node.js dan MariaDB.

---

## 2. Gambaran Umum Sistem

### 2.1 Deskripsi Sistem

Sistem Informasi Posyandu Girimulyo adalah aplikasi web yang terdiri dari dua area utama:

- Area publik untuk informasi stunting dan profil pendukung desa.
- Area petugas untuk login, kalkulator status gizi, histori pemeriksaan, dan export laporan.

Area publik menampilkan halaman Home, Penyebab & Pencegahan, Dampak, serta struktur Pemerintahan Desa Girimulyo. Area petugas hanya dapat diakses setelah login melalui halaman Kalkulator.

### 2.2 Pengguna Sistem

| Pengguna | Peran | Kebutuhan Utama |
|---|---|---|
| Masyarakat | Pengunjung publik | Membaca informasi stunting, pencegahan, dampak, dan profil Posyandu |
| Kader Plamboyan 1-6 | Petugas lokasi | Menginput data anak, menghitung status gizi, menyimpan histori, dan mengunduh laporan lokasi masing-masing |
| Admin Plamboyan | Pengelola semua data | Melihat data seluruh Plamboyan dan mengunduh rekap keseluruhan |
| Pengembang | Pemelihara teknis | Menjalankan, memperbaiki, deploy, dan mengelola konfigurasi database |

### 2.3 Ruang Lingkup Fitur

Fitur yang dikembangkan meliputi:

- Halaman Home dengan informasi stunting.
- Halaman Penyebab & Pencegahan stunting.
- Halaman Dampak stunting.
- Struktur Pemerintahan Desa Girimulyo.
- Navbar responsif dengan tombol Login.
- Menu Kalkulator yang muncul setelah login.
- Login petugas Posyandu.
- 6 akun lokasi Plamboyan dan 1 akun admin seluruh data.
- Kalkulator status gizi anak.
- Validasi input nama dan NIK.
- Input berat dan tinggi dengan dukungan angka desimal koma atau titik.
- Perhitungan umur dalam bulan.
- Hasil analisis dengan keterangan yang mudah dipahami.
- Simpan histori ke database MariaDB.
- Histori pemeriksaan berdasarkan bulan.
- Pencarian histori berdasarkan nama anak.
- Export hasil satu anak ke Excel.
- Export histori bulan tertentu atau seluruh histori ke Excel.
- Logout petugas.

---

## 3. Analisis Kebutuhan

### 3.1 Kebutuhan Fungsional Publik

| Kode | Kebutuhan | Status |
|---|---|---|
| FP-01 | Sistem menampilkan halaman Home Posyandu Girimulyo | Selesai |
| FP-02 | Sistem menampilkan informasi stunting | Selesai |
| FP-03 | Sistem menampilkan penyebab stunting | Selesai |
| FP-04 | Sistem menampilkan langkah pencegahan stunting | Selesai |
| FP-05 | Sistem menampilkan dampak stunting | Selesai |
| FP-06 | Sistem menampilkan struktur Pemerintahan Desa Girimulyo | Selesai |
| FP-07 | Sistem menyediakan navigasi yang responsif | Selesai |
| FP-08 | Sistem menampilkan tombol Login sebelum pengguna masuk | Selesai |

### 3.2 Kebutuhan Fungsional Petugas

| Kode | Kebutuhan | Status |
|---|---|---|
| FK-01 | Petugas dapat login menggunakan akun Posyandu | Selesai |
| FK-02 | Sistem menampilkan menu Kalkulator setelah login | Selesai |
| FK-03 | Petugas dapat memilih tanggal sesi Posyandu | Selesai |
| FK-04 | Admin dapat memilih lokasi Plamboyan saat input data | Selesai |
| FK-05 | Petugas lokasi hanya menyimpan data sesuai Plamboyan masing-masing | Selesai |
| FK-06 | Petugas dapat menginput identitas anak dan ibu | Selesai |
| FK-07 | Sistem memvalidasi nama agar tidak berisi angka | Selesai |
| FK-08 | Sistem memvalidasi NIK agar berisi angka dan 16 digit | Selesai |
| FK-09 | Sistem menerima berat dan tinggi dengan koma atau titik desimal | Selesai |
| FK-10 | Sistem menghitung usia anak dalam bulan | Selesai |
| FK-11 | Sistem menghitung status gizi anak | Selesai |
| FK-12 | Sistem menampilkan hasil analisis dengan keterangan jelas | Selesai |
| FK-13 | Petugas dapat menyimpan hasil ke database | Selesai |
| FK-14 | Petugas dapat melihat histori pemeriksaan | Selesai |
| FK-15 | Petugas dapat mencari histori berdasarkan nama anak | Selesai |
| FK-16 | Petugas dapat memfilter histori berdasarkan bulan | Selesai |
| FK-17 | Petugas dapat export hasil dan histori ke Excel | Selesai |
| FK-18 | Petugas dapat logout | Selesai |

### 3.3 Kebutuhan Non-fungsional

| Kode | Kebutuhan | Implementasi |
|---|---|---|
| NF-01 | Responsif pada desktop dan mobile | React dan Tailwind CSS |
| NF-02 | Tampilan modern dan mudah digunakan | Layout card, gradient halus, navbar animasi, dan form bertahap |
| NF-03 | Database relasional | MariaDB dengan tabel `nutrition_histories` |
| NF-04 | Export laporan mudah dibaca | `xlsx-js-style` dengan header berwarna dan lebar kolom otomatis |
| NF-05 | Keamanan halaman kalkulator | Session cookie HTTP-only |
| NF-06 | Pemisahan data lokasi | Field `posyandu_name` dan filter berdasarkan session |
| NF-07 | Validasi server-side | API histori mengecek session sebelum akses data |
| NF-08 | Siap deploy hosting Node.js | Next.js API route dan dokumentasi Hostinger |

---

## 4. Perancangan Sistem

### 4.1 Arsitektur Aplikasi

Aplikasi menggunakan arsitektur Next.js App Router. Struktur utama aplikasi adalah:

- `app` untuk halaman dan API route.
- `components` untuk komponen tampilan.
- `lib` untuk auth, koneksi database, kalkulasi gizi, dan data halaman.
- `public` untuk aset gambar dan logo.
- `database.sql` untuk skema database MariaDB.

### 4.2 Stack Teknologi

| Kategori | Teknologi |
|---|---|
| Framework | Next.js App Router |
| Bahasa | JavaScript |
| UI | React dan Tailwind CSS |
| Animasi Navbar | GSAP |
| Ikon | Font Awesome |
| Database | MariaDB |
| Driver Database | `mariadb` |
| Export Excel | `xlsx-js-style` |
| Runtime | Node.js |
| Hosting Rencana | Hostinger dengan dukungan Node.js dan MariaDB |

### 4.3 Perancangan Hak Akses

Hak akses dibagi menjadi:

- Publik: dapat melihat halaman informasi tanpa login.
- Petugas Plamboyan: dapat mengakses kalkulator dan histori sesuai lokasi masing-masing.
- Admin Plamboyan: dapat memilih lokasi input dan melihat seluruh data Plamboyan.

Navbar juga mengikuti status login:

- Sebelum login, navbar menampilkan tombol `Login`.
- Setelah login, menu `Kalkulator` muncul di navbar.
- Setelah logout, menu `Kalkulator` disembunyikan kembali.

### 4.4 Perancangan Data Utama

Entitas utama yang digunakan adalah `nutrition_histories`.

| Field | Fungsi |
|---|---|
| `id` | Primary key histori |
| `posyandu_name` | Nama lokasi Plamboyan |
| `session_date` | Tanggal sesi Posyandu |
| `nik_anak` | NIK anak |
| `nama_anak` | Nama anak |
| `nik_ibu` | NIK ibu |
| `nama_ibu` | Nama ibu |
| `jenis_kelamin` | Jenis kelamin anak |
| `tanggal_lahir` | Tanggal lahir anak |
| `usia` | Usia tampil |
| `usia_bulan` | Usia anak dalam bulan |
| `berat` | Berat badan anak |
| `tinggi` | Tinggi badan anak |
| `imt` | Indeks massa tubuh |
| `is_stunted` | Status indikasi stunting |
| `stunting_conclusion` | Kesimpulan stunting |
| `wfa_z`, `hfa_z`, `wfh_z`, `bmifa_z` | Nilai Z-score indikator gizi |
| `wfa_status`, `hfa_status`, `wfh_status`, `bmifa_status` | Status interpretasi indikator |
| `result_json` | Data hasil lengkap dalam bentuk JSON |
| `created_at` | Waktu data tersimpan |

---

## 5. Implementasi Sistem

### 5.1 Implementasi Halaman Publik

Halaman publik dikembangkan menggunakan komponen `InfoPage`. Konten halaman disimpan di `lib/pages.js`, sehingga isi informasi dapat diperbarui dengan lebih mudah.

Halaman publik meliputi:

- Home.
- Penyebab & Pencegahan.
- Dampak.
- Redirect halaman Pencegahan lama ke halaman Penyebab & Pencegahan.

Bagian Home juga memuat struktur Pemerintahan Desa Girimulyo yang disusun dalam bentuk bagan visual.

### 5.2 Implementasi Navbar

Navbar dikembangkan pada `components/navbar.jsx` dengan animasi GSAP. Navbar memiliki fitur:

- Logo Posyandu Girimulyo.
- Navigasi halaman publik.
- Tombol Login sebelum user masuk.
- Menu Kalkulator setelah user login.
- Menu mobile responsif.
- Status login dicek melalui endpoint `/api/session` agar tampilan navbar mengikuti session.

### 5.3 Implementasi Login

Login dikembangkan menggunakan:

- `components/LoginForm.jsx` untuk tampilan form.
- `app/api/login/route.js` untuk validasi login.
- `lib/auth.js` untuk daftar akun dan helper session.
- `app/api/logout/route.js` untuk logout.
- Cookie HTTP-only untuk menyimpan session.

Akun dibagi menjadi:

- 1 akun admin seluruh Plamboyan.
- 6 akun lokasi Plamboyan 1 sampai Plamboyan 6.

Password tidak dicantumkan pada laporan ini dan hanya diberikan kepada pihak internal yang berwenang.

### 5.4 Implementasi Kalkulator Gizi

Kalkulator berada pada `components/NutritionCalculator.jsx`. Alur penggunaannya adalah:

1. Petugas login.
2. Petugas mengisi tanggal sesi Posyandu.
3. Petugas mengisi identitas anak dan ibu.
4. Petugas mengisi jenis kelamin, tanggal lahir, berat, dan tinggi.
5. Sistem memvalidasi input.
6. Sistem menghitung umur anak dalam bulan.
7. Sistem menghitung nilai indikator gizi.
8. Sistem menampilkan hasil analisis.
9. Petugas menyimpan hasil ke database.
10. Petugas dapat mengunduh hasil atau histori ke Excel.

Indikator yang digunakan:

- Berat Badan menurut Umur.
- Tinggi Badan menurut Umur.
- Berat Badan menurut Tinggi Badan.
- Indeks Massa Tubuh menurut Umur.

### 5.5 Implementasi Histori dan Laporan

Histori pemeriksaan disimpan melalui API `app/api/nutrition-history/route.js`.

Fitur histori meliputi:

- Melihat histori bulan tertentu.
- Melihat semua histori.
- Filter berdasarkan nama anak.
- Pemisahan data berdasarkan Plamboyan untuk akun lokasi.
- Akses seluruh data untuk akun admin.
- Export hasil tunggal ke Excel.
- Export histori ke Excel.

Format Excel dibuat lebih mudah dibaca dengan:

- Header tabel berwarna.
- Border tabel.
- Wrap text.
- Auto filter.
- Lebar kolom menyesuaikan isi.

### 5.6 Implementasi Database

Database menggunakan MariaDB. Koneksi database berada pada `lib/db.js`, sedangkan skema tabel tersedia pada `database.sql`.

Environment variable yang dibutuhkan:

```bash
MARIADB_HOST="host_database"
MARIADB_PORT="3306"
MARIADB_USER="user_database"
MARIADB_PASSWORD="password_database"
MARIADB_DATABASE="nama_database"
MARIADB_CONNECTION_LIMIT="5"
```

Tabel utama:

```sql
nutrition_histories
```

Index dibuat untuk:

- Waktu pembuatan data.
- Nama anak.
- Tanggal sesi.
- Kombinasi lokasi Posyandu dan tanggal sesi.

---

## 6. Keamanan Sistem

Keamanan yang diterapkan:

- Halaman kalkulator hanya menampilkan fitur utama setelah login.
- API histori menolak akses jika pengguna belum login.
- Cookie session menggunakan `httpOnly`.
- Cookie session menggunakan `sameSite: lax`.
- Cookie menggunakan mode `secure` saat production.
- Password tidak ditampilkan pada halaman login.
- Form password memiliki tombol mata untuk melihat atau menyembunyikan input.
- Data Plamboyan dipisahkan berdasarkan session pengguna.
- Fitur hapus data dihilangkan untuk mengurangi risiko kehilangan data.

Catatan peningkatan keamanan berikutnya:

- Memindahkan akun login ke database.
- Menyimpan password dalam bentuk hash.
- Menambah role management.
- Menambah audit log aktivitas.
- Menambah rate limit login.
- Menambah backup database berkala.

---

## 7. Pengujian Sistem

### 7.1 Pengujian Fungsional

| No | Skenario | Hasil |
|---|---|---|
| 1 | Membuka halaman Home | Berhasil |
| 2 | Membuka halaman Penyebab & Pencegahan | Berhasil |
| 3 | Membuka halaman Dampak | Berhasil |
| 4 | Login dengan akun petugas | Berhasil |
| 5 | Menu Kalkulator muncul setelah login | Berhasil |
| 6 | Tombol Login tidak muncul setelah login | Berhasil |
| 7 | Menginput nama dengan angka | Sistem memberi peringatan |
| 8 | Menginput NIK tidak 16 digit | Sistem memberi peringatan |
| 9 | Menginput berat/tinggi dengan koma | Berhasil diproses |
| 10 | Menghitung status gizi anak | Berhasil |
| 11 | Menyimpan hasil ke database | Berhasil jika koneksi database aktif |
| 12 | Menampilkan histori | Berhasil jika database aktif |
| 13 | Mencari histori berdasarkan nama | Berhasil |
| 14 | Memfilter histori per bulan | Berhasil |
| 15 | Export laporan Excel | Berhasil |
| 16 | Logout | Berhasil |

### 7.2 Pengujian Teknis

Pengujian teknis dilakukan menggunakan perintah:

```bash
npm run lint
npm run build
```

Hasil terakhir:

- `npm run lint`: berhasil tanpa error.
- `npm run build`: berhasil tanpa error.

---

## 8. Panduan Penggunaan Singkat

### 8.1 Pengunjung Publik

1. Buka website Posyandu Girimulyo.
2. Pilih menu Home, Penyebab & Pencegahan, atau Dampak.
3. Baca informasi edukasi stunting.
4. Klik Login jika ingin masuk ke fitur kalkulator.

### 8.2 Petugas Posyandu

1. Klik tombol Login pada navbar.
2. Masukkan email dan password yang diberikan.
3. Setelah login, buka menu Kalkulator.
4. Isi tanggal sesi, identitas anak, data ibu, jenis kelamin, tanggal lahir, berat, dan tinggi.
5. Klik Hitung Status Gizi.
6. Periksa hasil analisis.
7. Klik Simpan ke Database jika hasil akan direkap.
8. Buka Histori untuk melihat data yang sudah tersimpan.
9. Gunakan pencarian nama atau filter bulan jika diperlukan.
10. Klik Download History untuk membuat laporan Excel.

### 8.3 Admin Plamboyan

1. Login menggunakan akun admin.
2. Pilih lokasi Plamboyan saat menginput data.
3. Buka Histori untuk melihat data seluruh Plamboyan.
4. Gunakan filter bulan atau semua histori.
5. Download laporan sesuai kebutuhan.

---

## 9. Kebutuhan Deploy

Karena aplikasi menggunakan Next.js API route dan koneksi MariaDB, hosting harus mendukung:

- Node.js.
- MariaDB atau MySQL.
- Environment variables.
- Perintah build dan start.

Perintah umum deploy:

```bash
npm install
npm run build
npm run start
```

Database perlu dibuat terlebih dahulu, lalu file `database.sql` diimport melalui phpMyAdmin atau tool database lain yang tersedia di hosting.

---

## 10. Kesimpulan

Sistem Informasi Posyandu Girimulyo telah dikembangkan sebagai aplikasi web untuk mendukung edukasi stunting dan pencatatan status gizi anak. Sistem menyediakan halaman informasi publik, login petugas, kalkulator status gizi, pemisahan data Plamboyan, histori pemeriksaan, pencarian data, filter bulan, serta export laporan Excel.

Dengan adanya sistem ini, proses pencatatan dan rekap data Posyandu dapat dilakukan dengan lebih rapi, cepat, dan terstruktur. Sistem juga sudah disiapkan untuk deploy pada hosting yang mendukung Node.js dan MariaDB.

Pengembangan berikutnya yang disarankan adalah peningkatan keamanan akun melalui database dan password hash, penambahan dashboard statistik desa, backup database otomatis, serta validasi standar antropometri bersama tenaga kesehatan.
