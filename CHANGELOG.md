# Changelog

Catatan perkembangan aplikasi **Skrining EPDS (Edinburgh Postnatal Depression Scale)**. Entri di bawah merangkum fitur yang sudah tersedia di codebase, bukan jaminan bahwa seluruh perubahan telah dirilis ke production.

## Belum dirilis

### Ditambahkan

- Manajemen `facility_types` dan `facilities` melalui halaman `/facility`, tersedia untuk role `super_admin` dan `midwife`.
- Operasi tambah, lihat, ubah, dan hapus lunak untuk jenis fasilitas dan fasilitas. Penghapusan ditolak jika data masih digunakan oleh fasilitas atau pengguna terkait.
- Form fasilitas dengan pilihan wilayah bertingkat: provinsi, kabupaten/kota, kecamatan, lalu desa/kelurahan.
- Pilihan fasilitas kesehatan pada form tambah dan edit pengguna, serta penyimpanan relasi melalui `users.facility_id`.
- Validasi server menggunakan Form Request untuk perubahan data fasilitas dan penetapan fasilitas pada pengguna.

### Diubah

- Opsi wilayah kini dibaca dari tabel lokal `provinces`, `regencies`, `districts`, dan `villages`, bukan API wilayah eksternal. Endpoint wilayah memfilter setiap tingkat berdasarkan induknya.
- Halaman fasilitas mengikuti pola UI User Management dan komponen shadcn yang sudah digunakan aplikasi.
- Pengguna memiliki relasi Eloquent ke fasilitas.

### Database

- Struktur `facility_types` dan `facilities` mencakup tipe fasilitas, hierarki induk-anak, serta kode wilayah administratif.
- Kolom `facility_id` pada `users` menghubungkan pengguna dengan fasilitas kesehatan. Kolom ini dapat kosong.
- Seeder fasilitas tersedia untuk mengisi contoh jenis fasilitas dan fasilitas.

### Catatan

- `facility_id` memungkinkan pengguna dikaitkan dengan fasilitas, tetapi **isolasi data per fasilitas belum diterapkan secara menyeluruh**. Query, ekspor, dashboard, notifikasi, API, serta rekam medis lama masih perlu diaudit dan diberi aturan akses tenant yang konsisten.
- Sebelum mengaktifkan isolasi di production, data lama perlu dipetakan dan diverifikasi; jangan menetapkan fasilitas secara otomatis jika pemetaannya ambigu. Lakukan backup, uji migrasi/backfill pada salinan data, dan rilis bertahap.
- Build frontend berhasil. Test database belum dapat dijalankan di lingkungan pengembangan ini karena PHP tidak memiliki driver SQLite.

## Fitur utama aplikasi

- Skrining EPDS dan pengelolaan kunjungan ibu nifas.
- Pengelolaan data ibu/pasien dan bayi.
- Pencatatan tindak lanjut bidan, hasil skrining, serta rekomendasi.
- Manajemen pengguna dan role, dashboard, notifikasi, dan autentikasi.
