# Changelog

Semua perubahan penting pada **Skrining EPDS (Edinburgh Postnatal Depression Scale)** dicatat di sini. Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) dan menggunakan Semantic Versioning untuk rilis.

## [Unreleased]

### Added

- Manajemen `facility_types` dan `facilities` melalui halaman `/facility`, tersedia untuk role `super_admin` dan `midwife`.
- Operasi tambah, lihat, ubah, dan hapus lunak untuk jenis fasilitas dan fasilitas. Penghapusan ditolak jika data masih digunakan oleh fasilitas atau pengguna terkait.
- Form fasilitas dengan pilihan wilayah bertingkat: provinsi, kabupaten/kota, kecamatan, lalu desa/kelurahan.
- Pilihan fasilitas kesehatan pada form tambah dan edit pengguna, serta penyimpanan relasi melalui `users.facility_id`.
- Validasi server menggunakan Form Request untuk perubahan data fasilitas dan penetapan fasilitas pada pengguna.
- Global scope akses fasilitas untuk membatasi data pasien, bayi, skrining, jawaban, hasil, dan tindak lanjut sesuai fasilitas bidan.
- Kolom nullable `postpartum_visits.facility_id` sebagai snapshot fasilitas pada saat skrining dibuat.
- Tes regresi untuk pemisahan data lintas fasilitas, data skrining legacy tanpa fasilitas, serta bidan yang belum memiliki fasilitas.

### Changed

- Opsi wilayah kini dibaca dari tabel lokal `provinces`, `regencies`, `districts`, dan `villages`, bukan API wilayah eksternal. Endpoint wilayah memfilter setiap tingkat berdasarkan induknya.
- Halaman fasilitas mengikuti pola UI User Management dan komponen shadcn yang sudah digunakan aplikasi.
- Pengguna memiliki relasi Eloquent ke fasilitas.
- Skrining baru mewarisi fasilitas dari pasien; perubahan fasilitas pasien di kemudian hari tidak mengubah fasilitas yang tercatat pada skrining sebelumnya.
- Endpoint API bidan dibatasi untuk role `super_admin`, `admin`, dan `midwife`.
- Notifikasi skrining EPDS terlewat hanya dikirim kepada bidan yang bertugas di fasilitas skrining terkait, serta admin dan super admin.
- Form manajemen pengguna yang diakses bidan hanya menampilkan fasilitas penugasannya.
- Form pengguna tidak lagi meminta wilayah kerja, jenis instansi, atau nama instansi terpisah untuk bidan; penugasan fasilitas menjadi acuan dan wajib untuk akun bidan baru atau yang diperbarui. Kolom data wilayah lama di database tetap dipertahankan.

### Security

- Bidan tidak dapat membaca pasien atau skrining dari fasilitas lain. Data historis dengan `facility_id` kosong tidak ditampilkan kepada bidan dan tetap dapat ditinjau oleh admin atau super admin.
- Validasi pembuatan dan perubahan bayi membatasi relasi ibu ke pasien yang berada dalam cakupan fasilitas bidan atau ke akun pasien yang sedang login.
- Validasi penetapan fasilitas mencegah bidan mengaitkan pengguna ke fasilitas lain.

### Database

- Migrasi menambahkan `postpartum_visits.facility_id` sebagai foreign key nullable. Skrining lama tidak di-backfill, sehingga data production yang belum terpetakan tetap dipertahankan tanpa dibuka kepada bidan.
- Migrasi perlu dijalankan sebelum rilis aplikasi yang menggunakan kolom baru. Uji pada salinan database dan pastikan backup tersedia sebelum deployment.

### Verification

- Pemeriksaan sintaks PHP, Laravel Pint, dan pemeriksaan whitespace berhasil.
- `FacilitiesTest` belum dapat dijalankan karena PHP di lingkungan pengembangan tidak memiliki driver SQLite (`could not find driver`).
- Catatan ini mendokumentasikan perubahan di codebase dan tidak menyatakan bahwa perubahan telah dirilis ke production.

## Fitur utama aplikasi

- Skrining EPDS dan pengelolaan kunjungan ibu nifas.
- Pengelolaan data ibu/pasien dan bayi.
- Pencatatan tindak lanjut bidan, hasil skrining, serta rekomendasi.
- Manajemen pengguna dan role, dashboard, notifikasi, dan autentikasi.
