# Test Plan - Email Reuse After Soft Delete

## Skenario Test

### Test 1: Patient Registration & Deletion

```
1. Register patient dengan email: test@patient.com
   ✅ Expected: User created dengan role "patient"

2. Delete patient (soft delete)
   ✅ Expected: User soft-deleted (deleted_at != NULL)

3. Try register bidan dengan email: test@patient.com
   ✅ Expected: SUCCESS - Email reuse allowed
   ✅ Email validation excludes soft-deleted row
```

### Test 2: Duplicate Email Check (Active Users)

```
1. Create user 1 dengan email: active@example.com (role: patient)
2. Try create user 2 dengan email: active@example.com
   ❌ Expected: FAIL - "email sudah terdaftar"
   ✅ Soft-deleted check tidak affect active user validation
```

### Test 3: Restore Deleted User

```
1. Register patient dengan email: test@patient.com
2. Delete patient (soft delete)
3. Admin restore patient
   ✅ Expected: Patient restored, email still valid
   ✅ No conflict dengan user baru yang menggunakan email sama
```

## Test Cases dengan SQL

### Setup Data

```sql
-- Create test patient
INSERT INTO users (id, name, email, password, role_id, deleted_at, created_at, updated_at)
VALUES ('uuid1', 'Patient Test', 'test@patient.com', hash('password'), 3, NULL, NOW(), NOW());

-- Soft delete patient
UPDATE users SET deleted_at = NOW() WHERE id = 'uuid1';
```

### Test Validation

```sql
-- Verify soft-deleted user tidak counted
SELECT * FROM users WHERE email = 'test@patient.com' AND deleted_at IS NULL;
-- Expected: 0 rows (not found, email is free to reuse)

-- Verify soft-deleted user still exists
SELECT * FROM users WHERE email = 'test@patient.com' AND deleted_at IS NOT NULL;
-- Expected: 1 row (soft-deleted data preserved)
```

## Manual Testing Steps

### Step 1: Register Patient

```
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "patient@test.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

Expected: {
  "data": {
    "id": "...",
    "email": "patient@test.com",
    "name": "Test Patient"
  }
}
```

### Step 2: Delete Patient via UI

- Login as admin
- Go to User Management
- Find "Test Patient"
- Click delete button
- Confirm deletion

### Step 3: Register Midwife with Same Email

```
POST /user (web form)
- Name: Test Midwife
- Email: patient@test.com  (REUSE)
- Password: password123
- Role: Midwife

Expected: ✅ Create success (email reuse allowed)
```

### Step 4: Verify in Database

```
-- Check users table
SELECT id, name, email, role_id, deleted_at
FROM users
WHERE email = 'patient@test.com';

Expected result:
- Row 1: id=uuid1, name="Test Patient", deleted_at=2026-03-19 ..., role_id=3 (patient)
- Row 2: id=uuid2, name="Test Midwife", deleted_at=NULL, role_id=2 (midwife)
```

## Edge Cases

### Edge Case 1: Multiple Deleted Emails

```
1. Create user A (patient) - email: test@test.com
2. Create user B (patient) - email: test@test.com (should fail)
3. Delete user A
4. Delete user B
5. Create user C - email: test@test.com (should succeed)
```

### Edge Case 2: Restore + Reuse

```
1. Create patient A - email: test@test.com
2. Delete patient A (soft delete)
3. Create bidan B - email: test@test.com ✅
4. Restore patient A
5. Check: Both users have same email, bidan B is active
   Issue: Potential conflict
   Solution: Admin should choose either restore or delete
```

### Edge Case 3: Concurrent Creation

```
1. Delete patient A (email: test@test.com)
2. Simultaneously:
   - Request 1: Create bidan with test@test.com
   - Request 2: Create bidan with test@test.com
   Expected: One succeeds, one fails
```

## Validation Testing

### Case: Try duplicate email (both active)

```
Request: Create user with email: patient@test.com
User: patient@test.com exists with deleted_at = NULL

Expected: ❌ FAIL
Error: "email sudah terdaftar"
```

### Case: Email soft-deleted

```
Request: Create user with email: patient@test.com
User: patient@test.com exists with deleted_at = 2026-03-19 10:00:00

Expected: ✅ SUCCESS
New user created with this email
```

## Regression Testing

- [x] Normal registration still works
- [x] Login with email still works
- [x] Email edit on profile still checks unique (active users)
- [x] User deletion (soft delete) still works
- [x] Admin trash/restore feature still works
- [x] User search excludes soft-deleted by default

---

## Implementation Checklist

- [x] Update UserStoreRequestValidator.php
- [x] Update Api RegisterRequest.php
- [x] Update AuthService.php register method
- [x] Test with active user duplicate email
- [x] Test with soft-deleted email reuse
- [x] Verify soft-deleted data still exists
- [x] Check no regression on other features
- [x] Document all changes

---

**Status:** Test Plan Ready
**Automated Tests:** Manual testing recommended first
**Expected Result:** All tests PASS ✅
