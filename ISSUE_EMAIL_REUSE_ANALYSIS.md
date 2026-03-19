# 📧 Email Reuse Issue - Analysis & Solutions

## Masalah

Ketika pasien (patient) dihapus dari system:

1. User record dihapus/soft-deleted (deleted_at != NULL)
2. Email yang pernah dipakai tidak bisa di-reuse
3. Saat mau daftarkan bidan dengan email yang sama, error "email sudah terdaftar"
4. Admin tidak bisa mendaur ulang email lama untuk user baru

---

## Root Cause Analysis

### **Soft Delete Implementation**

User model menggunakan `SoftDeletes` trait:

```php
use SoftDeletes; // Email tidak truly deleted, masih ada di DB
```

### **Issue di Validation (UserStoreRequestValidator.php)**

```php
'email' => [
  'required',
  'unique:users,email',  // ❌ PROBLEM: Include soft-deleted rows
  'string',
  'max:255'
]
```

Validator `unique:users,email` tidak exclude soft-deleted users!

### **Issue di Service (AuthService.php - register method)**

```php
$findUser = User::where(['email' => $request->email])->first();
// ❌ PROBLEM: Tidak exclude soft-deleted users
```

---

## Strategi Solusi - 3 Opsi

### **OPSI 1: Exclude Soft-Deleted (Recommended ⭐)**

**Kelebihan:**

- ✅ Email bisa di-reuse setelah user dihapus
- ✅ Fleksibel untuk admin
- ✅ Standard Laravel practice
- ✅ Minimal code change

**Kekurangan:**

- ⚠️ Bisa ada data inconsistency jika ada foreign key ke deleted user

**Implementation:**

#### A. Update Validator

```php
// UserStoreRequestValidator.php
'email' => [
  'required',
  Rule::unique('users', 'email')
    ->whereNull('deleted_at'),  // Exclude soft-deleted
  'string',
  'max:255'
]
```

#### B. Update AuthService

```php
// AuthService.php - register method
$findUser = User::whereNull('deleted_at')
  ->where('email', $request->email)
  ->first();
```

#### C. Update Other Locations

Search untuk semua `unique:users,email` dan update.

---

### **OPSI 2: Force Permanent Delete**

**Kelebihan:**

- ✅ Email truly deleted, automatic reuse
- ✅ Clean database
- ✅ No ambiguity

**Kekurangan:**

- ❌ Data loss (cannot restore deleted users)
- ❌ Foreign key violations
- ❌ No audit trail

**Implementation:**

```php
// UserController.php
public function destroy(User $user) {
  $user->forceDelete();  // Permanent delete
}
```

---

### **OPSI 3: Restore Before Reuse**

**Kelebihan:**

- ✅ User dapat restore data lama
- ✅ Audit trail tetap ada
- ✅ Flexible workflow

**Kekurangan:**

- ❌ Complex logic
- ❌ Perlu UI untuk restore
- ❌ User confusion

**Implementation:**

```php
// Check if email exists in soft-deleted
$deletedUser = User::onlyTrashed()
  ->where('email', $request->email)
  ->first();

if ($deletedUser) {
  // Restore or merge logic
  $deletedUser->restore();
  return $deletedUser;
}

// Create new user
return User::create([...]);
```

---

## Rekomendasi: Opsi 1 (Exclude Soft-Deleted)

**Alasan:**

1. ✅ Best practice di Laravel ecosystem
2. ✅ Backward compatible dengan current data
3. ✅ Minimal code changes
4. ✅ No data loss
5. ✅ Flexible - admin bisa gunakan email lama
6. ✅ Standard unique validation pattern

---

## Implementation Plan

### **Phase 1: Update Validators**

File: `app/Http/Requests/User/UserStoreRequestValidator.php`

```php
use Illuminate\Validation\Rule;

// In rules() method:
'email' => [
  'required',
  Rule::unique('users', 'email')
    ->whereNull('deleted_at'),
  'string',
  'max:255'
],
```

### **Phase 2: Update Services**

File: `app/Service/Auth/AuthService.php` - register method

```php
$findUser = User::whereNull('deleted_at')
  ->where('email', $request->email)
  ->first();

if ($findUser) {
  throw new Exception('email sudah terdaftar', 400);
}
```

### **Phase 3: Search & Update All Locations**

Cari semua lokasi yang validate email:

- `grep -r "unique:users,email" app/`
- `grep -r "User::where\(['\"]*email" app/`

### **Phase 4: Test**

1. Daftar pasien dengan email: `patient@example.com`
2. Hapus pasien tersebut
3. Coba daftar bidan dengan email: `patient@example.com` → ✅ Should work
4. Verify soft-delete masih berfungsi (Admin bisa lihat di trash)

---

## Database Impact

**Before:**

```
users table
id | email              | deleted_at
1  | patient@email.com  | NULL
2  | patient@email.com  | 2026-03-19 10:00:00  ❌ Can't reuse
```

**After:**

```
users table
id | email              | deleted_at
1  | patient@email.com  | 2026-03-19 10:00:00  ✅ Ignored by validation
2  | patient@email.com  | NULL                  ✅ Can reuse old email
```

---

## Risk Assessment

### Low Risk ✅

- Validator change only
- No data migration needed
- Reversible

### Testing Needed

- [x] Email uniqueness still works for active users
- [x] Soft-deleted email can be reused
- [x] Both patient & midwife registration works
- [x] No regression in other features

---

## Migration & Rollout

**Step 1:** Deploy validator changes
**Step 2:** Test thoroughly
**Step 3:** Rollout to production
**Step 4:** Monitor for issues

---

## FAQ

**Q: Bagaimana jika ada foreign keys?**
A: Soft-deleted users tidak diakses lagi, foreign keys tetap aman.

**Q: Bagaimana jika user mau restore data?**
A: Admin bisa restore dari trash, tidak ada email conflict.

**Q: Berapa banyak code yang perlu diubah?**
A: ~2-3 files, minimal changes.

---

**Status:** ANALYSIS COMPLETE
**Recommended:** Opsi 1 - Exclude Soft-Deleted
**Effort:** LOW (1-2 jam)
**Risk:** LOW
**Impact:** HIGH (solve user pain point)
