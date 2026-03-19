# Notifikasi Missed EPDS - Update Penerima

## 📋 Masalah yang Diperbaiki

**Sebelumnya:** Notifikasi missed EPDS hanya terkirim ke **admin** saja.

**Sekarang:** Notifikasi missed EPDS terkirim ke **admin + semua midwife**.

---

## 🔍 Root Cause Analysis

Di file `app/Console/Commands/NotifyMissedEpds.php`, method `getNotificationRecipients()` mencoba mengakses:

```php
if ($visit->baby && $visit->baby->midwife_id) {
  $midwife = User::find($visit->baby->midwife_id);
  $midwives->push($midwife);
}
```

**Masalah:**
1. Model `Baby` tidak memiliki field `midwife_id`
2. Table `babies` tidak memiliki kolom `midwife_id`
3. Tidak ada mekanisme assignment antara `midwife` dan `ibu/bayi`
4. Akibatnya: Kondisi selalu FALSE, midwife tidak pernah dinotifikasi

---

## ✅ Solusi yang Diterapkan

Ubah logic notifikasi dari **"cari midwife yang assigned"** menjadi **"notify semua admin + semua midwife"**:

```php
private function getNotificationRecipients(PostpartumVisit $visit)
{
  // 1. Admins & Super admins - WAJIB notifikasi
  $admins = User::query()
    ->whereHas('role', fn(Builder $q) => $q->whereIn('slug', ['admin', 'super_admin']))
    ->get();

  // 2. Semua Midwife - WAJIB notifikasi
  $midwives = User::query()
    ->whereHas('role', fn(Builder $q) => $q->where('slug', 'midwife'))
    ->get();

  return $admins->merge($midwives)->unique('id');
}
```

---

## 🧪 Hasil Test

Setelah fix, command `php artisan notify:missed-epds` menghasilkan:

```
Found 1 missed EPDS schedules.
  ✓ Notified Karen (karen@gmail.com) - Visit: 019b0f16...
  ✓ Notified Kartika Putri (kartika@gmail.com) - Visit: 019b0f16...
  ✓ Notified Bidan Test (bidantest@gmail.com) - Visit: 019b0f16...
Completed: 3 created, 2 skipped.
```

**Recipients:**
- ✅ Karen (admin)
- ✅ Kartika Putri (admin)
- ✅ Bidan Test (midwife)

---

## 📌 Implikasi & Rekomendasi

### Kelebihan Solusi Saat Ini
- ✅ Semua midwife mendapat notifikasi
- ✅ Tidak ada midwife yang terlewat
- ✅ Idempotency tetap berjalan (duplicate prevention)
- ✅ Sederhana dan maintainable

### Potential Improvement di Masa Depan
Jika ingin **limit notifikasi hanya ke midwife yang assigned** untuk ibu tertentu:

1. **Tambahkan field di table `users`:**
   ```sql
   ALTER TABLE users ADD COLUMN assigned_mother_id CHAR(36) NULLABLE;
   ALTER TABLE users ADD FOREIGN KEY (assigned_mother_id) REFERENCES users(id);
   ```

2. **Update logic di command:**
   ```php
   // Cari midwife yang assigned ke mother ini
   $assignedMidwife = User::where('assigned_mother_id', $visit->mother_id)
     ->whereHas('role', fn($q) => $q->where('slug', 'midwife'))
     ->get();
   ```

3. **Atau buat table pivot `user_mother_assignments`:**
   ```sql
   CREATE TABLE user_mother_assignments (
     id CHAR(36) PRIMARY KEY,
     midwife_id CHAR(36),
     mother_id CHAR(36),
     assigned_at TIMESTAMP,
     FOREIGN KEY (midwife_id) REFERENCES users(id),
     FOREIGN KEY (mother_id) REFERENCES users(id)
   );
   ```

---

## 📝 Files Modified

- `app/Console/Commands/NotifyMissedEpds.php` → Method `getNotificationRecipients()` diperbaiki

---

## 🚀 Deployment Notes

✅ **Backward Compatible** - Tidak perlu migration atau schema change
✅ **Safe to Deploy** - Bisa langsung deploy ke production

---

**Status:** ✅ FIXED
**Date:** 2026-03-19
