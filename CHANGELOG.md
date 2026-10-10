# Changelog

Semua perubahan penting pada **Skrining EPDS (Edinburgh Postnatal Depression Scale)** dicatat di sini. Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) dan menggunakan Semantic Versioning untuk rilis.

## [Unreleased]

### Added

- PWA `/patient-app` khusus pasien dengan autentikasi, registrasi, profil, data bayi, skrining EPDS, hasil, riwayat, jadwal, dan notifikasi melalui API.
- Manifest, ikon, dan service worker PWA; cache hanya app shell dan aset statis, bukan respons API pasien.
- Penyimpanan subscription Web Push pasien terpisah dari token FCM aplikasi web yang sudah ada.
- Notifikasi Web Push berprioritas tinggi untuk jadwal skrining pasien, dengan penyimpanan notifikasi di dalam aplikasi.
- Konfigurasi Firebase Web dan kredensial server melalui variabel environment yang dicantumkan di `.env.example`.
- Manajemen `facility_types` dan `facilities` melalui halaman `/facility`, tersedia untuk role `super_admin` dan `midwife`.
- Operasi tambah, lihat, ubah, dan hapus lunak untuk jenis fasilitas dan fasilitas. Penghapusan ditolak jika data masih digunakan oleh fasilitas atau pengguna terkait.
- Form fasilitas dengan pilihan wilayah bertingkat: provinsi, kabupaten/kota, kecamatan, lalu desa/kelurahan.
- Pilihan fasilitas kesehatan pada form tambah dan edit pengguna, serta penyimpanan relasi melalui `users.facility_id`.
- Validasi server menggunakan Form Request untuk perubahan data fasilitas dan penetapan fasilitas pada pengguna.
- Global scope akses fasilitas untuk membatasi data pasien, bayi, skrining, jawaban, hasil, dan tindak lanjut sesuai fasilitas bidan.
- Kolom nullable `postpartum_visits.facility_id` sebagai snapshot fasilitas pada saat skrining dibuat.
- Tes regresi untuk pemisahan data lintas fasilitas, data skrining legacy tanpa fasilitas, serta bidan yang belum memiliki fasilitas.

### Changed

- Notifikasi hasil skrining pasien kini hanya dikirim kepada bidan yang memiliki `facility_id` sama; tidak ada fallback ke bidan fasilitas lain.
- Payload Web Push PWA menggunakan data-only agar service worker menampilkan notifikasi satu kali, serta memakai tag stabil untuk menghindari tampilan duplikat.
- Form data bayi di PWA menggunakan pemilih kalender, dropdown jam (00–23), dan dropdown menit (00–59); tanggal lahir dan waktu lokal dikirim bersama ke API.
- Opsi wilayah kini dibaca dari tabel lokal `provinces`, `regencies`, `districts`, dan `villages`, bukan API wilayah eksternal. Endpoint wilayah memfilter setiap tingkat berdasarkan induknya.
- Halaman fasilitas mengikuti pola UI User Management dan komponen shadcn yang sudah digunakan aplikasi.
- Pengguna memiliki relasi Eloquent ke fasilitas.
- Skrining baru mewarisi fasilitas dari pasien; perubahan fasilitas pasien di kemudian hari tidak mengubah fasilitas yang tercatat pada skrining sebelumnya.
- Endpoint API bidan dibatasi untuk role `super_admin`, `admin`, dan `midwife`.
- Notifikasi skrining EPDS terlewat hanya dikirim kepada bidan yang bertugas di fasilitas skrining terkait, serta admin dan super admin.
- Form manajemen pengguna yang diakses bidan hanya menampilkan fasilitas penugasannya.
- Form pengguna tidak lagi meminta wilayah kerja, jenis instansi, atau nama instansi terpisah untuk bidan; penugasan fasilitas menjadi acuan dan wajib untuk akun bidan baru atau yang diperbarui. Kolom data wilayah lama di database tetap dipertahankan.
- API publik `GET /api/v1/region/provinces`, `/regencies/{provinceCode}`, `/districts/{regencyCode}`, dan `/villages/{districtCode}` menyediakan pilihan wilayah berjenjang dari tabel lokal dengan format respons yang konsisten.
- API publik `GET /api/v1/facilities?regency_id={code}` menyediakan fasilitas aktif beserta jenisnya untuk kabupaten/kota yang dipilih.
- Profil pasien kini menyimpan dan mengembalikan `facility_id`; fasilitas wajib dipilih saat melengkapi atau memperbarui profil, dan menjadi syarat `has_profile`.
- Form tambah dan ubah profil di aplikasi mobile memuat wilayah dari API lokal serta meminta pilihan fasilitas kesehatan yang aktif.

### Security

- Bidan tidak dapat membaca pasien atau skrining dari fasilitas lain. Data historis dengan `facility_id` kosong tidak ditampilkan kepada bidan dan tetap dapat ditinjau oleh admin atau super admin.
- Validasi pembuatan dan perubahan bayi membatasi relasi ibu ke pasien yang berada dalam cakupan fasilitas bidan atau ke akun pasien yang sedang login.
- Validasi penetapan fasilitas mencegah bidan mengaitkan pengguna ke fasilitas lain.

### Database

- Migrasi menambahkan tabel `web_push_subscriptions` untuk menyimpan subscription browser pasien; jalankan migrasi sebelum mengaktifkan Web Push.
- Migrasi menambahkan `postpartum_visits.facility_id` sebagai foreign key nullable. Skrining lama tidak di-backfill, sehingga data production yang belum terpetakan tetap dipertahankan tanpa dibuka kepada bidan.
- Migrasi perlu dijalankan sebelum rilis aplikasi yang menggunakan kolom baru. Uji pada salinan database dan pastikan backup tersedia sebelum deployment.

### Verification

- Test PWA lulus (3 test, 21 assertion), ESLint untuk halaman PWA, pemeriksaan sintaks PHP, Laravel Pint, dan pemeriksaan whitespace berhasil.
- Build frontend berhasil untuk perubahan pemilih tanggal dan waktu bayi; satu percobaan build berikutnya berhenti karena crash proses saat Vite menghitung ukuran aset.
- `UserUpdateValidationTest` gagal pada lima test akibat `MassAssignmentException` di setup `Role::create()` (atribut `name` tidak fillable); belum ada test integrasi untuk routing notifikasi hasil berdasarkan fasilitas.
- Catatan ini mendokumentasikan perubahan di codebase dan tidak menyatakan bahwa perubahan telah dirilis ke production.

## Fitur utama aplikasi

- Skrining EPDS dan pengelolaan kunjungan ibu nifas.
- Pengelolaan data ibu/pasien dan bayi.
- Pencatatan tindak lanjut bidan, hasil skrining, serta rekomendasi.
- Manajemen pengguna dan role, dashboard, notifikasi, dan autentikasi.
