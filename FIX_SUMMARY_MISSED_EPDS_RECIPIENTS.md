# 🔔 Notifikasi Missed EPDS - Fix Summary

## Problem

Notifikasi missed EPDS hanya terkirim ke **admin** saja, **bidan tidak menerima notifikasi**.

---

## Root Cause

Di method `getNotificationRecipients()` command `NotifyMissedEpds.php`:

```php
// OLD CODE - BROKEN
if ($visit->baby && $visit->baby->midwife_id) {
  // Model Baby tidak memiliki field midwife_id
  // Jadi kondisi ini SELALU FALSE
  // Midwife TIDAK PERNAH dinotifikasi
}
```

**Masalah:**

1. Model `Baby` tidak memiliki field `midwife_id`
2. Tidak ada mekanisme assignment midwife ke ibu
3. Akibatnya: Hanya admin yang ternotifikasi

---

## Solution ✅

Ubah logic untuk **notify semua admin + semua bidan**:

```php
// NEW CODE - FIXED
// 1. Admins & Super admins
$admins = User::query()
  ->whereHas('role', fn(Builder $q) => $q->whereIn('slug', ['admin', 'super_admin']))
  ->get();

// 2. Semua Midwife
$midwives = User::query()
  ->whereHas('role', fn(Builder $q) => $q->where('slug', 'midwife'))
  ->get();

return $admins->merge($midwives)->unique('id');
```

---

## Test Results ✅

**Before Fix:**

```
Found 1 missed EPDS schedules.
  ✓ Notified Karen (karen@gmail.com)
  ✓ Notified Kartika Putri (kartika@gmail.com)
Completed: 2 created, 2 skipped.
```

❌ Bidan tidak ternotifikasi

**After Fix:**

```
Found 1 missed EPDS schedules.
  ✓ Notified Super Admin (test@example.com)
  ✓ Notified Admin (admin@gmail.com)
  ✓ Notified Karen (karen@gmail.com)
  ✓ Notified Kartika Putri (kartika@gmail.com)
  ✓ Notified Bidan Test (bidantest@gmail.com)
Completed: 5 created, 0 skipped.
```

✅ Semua admin dan bidan ternotifikasi!

---

## Recipients Table

| Role        | Count | Notified |
| ----------- | ----- | -------- |
| Super Admin | 1     | ✅       |
| Admin       | 3     | ✅       |
| Midwife     | 1     | ✅       |
| **TOTAL**   | **5** | **✅**   |

---

## Files Modified

- ✅ `app/Console/Commands/NotifyMissedEpds.php` → Fixed `getNotificationRecipients()` method
- ✅ `EPDS_NOTIFICATIONS.md` → Updated recipients documentation
- ✅ `NOTIFICATION_RECIPIENTS_UPDATE.md` → Created detailed changelog

---

## Deployment Status

✅ **Ready for Production**

- Backward compatible (no migrations needed)
- Idempotency still works
- Safe to deploy immediately

---

## Future Improvements (Optional)

Jika diperlukan assignment per midwife ke ibu tertentu:

1. **Add field ke users table:**

    ```sql
    ALTER TABLE users ADD COLUMN assigned_mother_id CHAR(36);
    ```

2. **Update command logic:**
    ```php
    $assignedMidwife = User::where('assigned_mother_id', $visit->mother_id)
      ->whereHas('role', fn($q) => $q->where('slug', 'midwife'))
      ->first();
    ```

Lihat `NOTIFICATION_RECIPIENTS_UPDATE.md` untuk detail lengkap.

---

**Status:** ✅ FIXED & TESTED  
**Date:** 2026-03-19  
**Deployed:** Ready
