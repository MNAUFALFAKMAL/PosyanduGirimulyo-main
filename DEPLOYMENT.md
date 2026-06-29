# Deploy Posyandu Girimulyo di Hostinger

## Kebutuhan Hosting

Project ini adalah Next.js dengan API route untuk login dan histori kalkulator, jadi hosting harus mendukung Node.js. Paket shared hosting biasa yang hanya PHP/static tidak cukup.

Gunakan paket Hostinger yang menyediakan:

- Managed Node.js atau fitur deploy aplikasi Node.js.
- MariaDB/MySQL database.
- Environment variables.
- Perintah build dan start.

## Environment Variables

Isi environment berikut di panel hosting:

```bash
MARIADB_HOST="host_database"
MARIADB_PORT="3306"
MARIADB_USER="user_database"
MARIADB_PASSWORD="password_database"
MARIADB_DATABASE="nama_database"
MARIADB_CONNECTION_LIMIT="1"
MARIADB_CONNECT_TIMEOUT="10000"
MARIADB_ACQUIRE_TIMEOUT="10000"
MARIADB_IDLE_TIMEOUT="30"
AUTH_SECRET="isi_random_secret_panjang_minimal_32_karakter"
```

Jangan commit `.env.local`.

`AUTH_SECRET` digunakan untuk menandatangani cookie login. Di production, variabel ini wajib diisi agar session tidak mudah dipalsukan.

## Database

Import file `database.sql` ke database MariaDB melalui phpMyAdmin atau tool database Hostinger.

Aplikasi juga akan mencoba membuat/melengkapi tabel otomatis saat API histori dipakai, tetapi import `database.sql` lebih jelas untuk setup pertama.

## Build dan Start

Gunakan perintah:

```bash
npm install
npm run build
npm run start
```

Pastikan versi Node.js di hosting memakai Node.js 20 LTS. Project ini sudah menetapkan `engines.node` ke `20.x` dan menyediakan `.nvmrc`.

## Catatan

- Aplikasi tidak lagi memakai Supabase/PostgreSQL.
- Histori kalkulator disimpan di tabel `nutrition_histories`.
- Akun login tetap hardcoded di aplikasi, bukan di database.
