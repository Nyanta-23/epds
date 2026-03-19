# Implementation Summary: EPDS Missed Schedule Notifications

## ✅ Apa yang Sudah Diimplementasi

### Backend (Laravel)

1. **`app/Console/Commands/NotifyMissedEpds.php`** ✅
    - Detect PostpartumVisit dengan `date_filled <= kemarin` dan belum ada Result
    - Create notifikasi ke admins + midwife yang bertanggung jawab
    - Idempotency: tidak create duplikat
    - Support `--force` flag untuk re-create

2. **`app/Notifications/MissedEpdsNotification.php`** ✅
    - Store notifikasi ke database (notifications table)
    - User-friendly message: "terlewat 3 hari" / "terlewat 1 minggu 2 hari" / dll
    - Data structure match dengan frontend expectation

3. **`bootstrap/app.php`** ✅
    - Scheduler: jalankan command daily at 07:00
    - `withoutOverlapping()` prevent duplicate runs
    - `onOneServer()` untuk distributed setups

4. **`routes/web.php`** ✅
    - Webhook route: `/cron/notify-missed-epds/{token}` untuk external cron
    - Secured dengan `APP_CRON_SECRET`

5. **`routes/api.php`** ✅
    - API endpoints untuk fetch notifikasi
    - `GET /api/v1/notifications` — unread count + list
    - `POST /api/v1/notifications/{id}/read` — mark as read

6. **`app/Http/Controllers/DashboardController.php`** ✅
    - Send `unreadNotifications` count ke Inertia
    - Backend ready untuk frontend display

### Frontend (React/Inertia)

7. **`resources/js/pages/dashboard.tsx`** ✅
    - Alert amber menampilkan unread notification count
    - "Anda memiliki X notifikasi jadwal pengisian EPDS terlewat"
    - Link "Lihat detail" ke `/notifications` page

8. **`resources/js/pages/notifications.tsx`** ✅ (sudah ada)
    - Display notification list dengan title, body, icon
    - Pagination support
    - Mark as read / redirect ke action URL

### Documentation

9. **`EPDS_NOTIFICATIONS.md`** ✅
    - Setup guide (host cron + external cron + manual)
    - Testing procedures
    - Troubleshooting

10. **`PRODUCTION_DEPLOYMENT.md`** ✅
    - Complete production checklist
    - Step-by-step deployment instructions
    - Post-deployment testing
    - Troubleshooting guide

---

## 📋 Langkah Deployment ke Production

### Phase 1: Preparation (Pre-Deployment)

```bash
# 1. Commit semua changes
git add -A
git commit -m "feat: implement EPDS missed schedule notifications system"

# 2. Push ke repository
git push origin master

# 3. Generate APP_CRON_SECRET token
php artisan str:random 32
# Copy output token

# 4. Prepare .env file updates
# Note down APP_CRON_SECRET value untuk add ke production .env
```

### Phase 2: Server Deployment

```bash
# 1. SSH ke production server
ssh user@your-production-server.com

# 2. Navigate ke app folder
cd /home/username/public_html/epds  # sesuaikan path

# 3. Pull latest code
git pull origin master

# 4. Update dependencies
composer install --optimize-autoloader --no-dev
npm install
npm run build

# 5. Add APP_CRON_SECRET ke .env
# Edit .env, tambah:
# APP_CRON_SECRET=your_token_here

# 6. Run migration
php artisan migrate

# 7. Clear cache
php artisan config:cache
php artisan view:clear
php artisan cache:clear
```

### Phase 3: Cron Setup (Pilih Satu)

**Option A: Host Cron (cPanel/Plesk)**

```
1. Login ke control panel
2. Cari "Cron Jobs"
3. Add: * * * * * cd /home/username/public_html/epds && /usr/bin/php artisan schedule:run >> /dev/null 2>&1
4. Save
```

**Option B: External Cron (cron-job.org)**

```
1. Buka https://cron-job.org
2. Create cron:
   URL: https://yourdomain.com/cron/notify-missed-epds/YOUR_SECRET
   Schedule: Daily 07:00
3. Enable dan test
```

### Phase 4: Verification

```bash
# SSH ke server, jalankan:

# 1. Check scheduler registered
php artisan schedule:list

# 2. Test command manual
php artisan notify:missed-epds

# 3. Check notifications stored
php artisan tinker
DB::table('notifications')->where('type', 'App\Notifications\MissedEpdsNotification')->count();
exit

# 4. Check dashboard alert (di browser)
# Go to https://yourdomain.com/dashboard
# Should show amber alert if notifications exist

# 5. Check notifications page
# Go to https://yourdomain.com/notifications
# Should show list of notifications
```

---

## 📁 Files Modified/Created

```
✅ Created:
  - app/Console/Commands/NotifyMissedEpds.php
  - app/Notifications/MissedEpdsNotification.php
  - EPDS_NOTIFICATIONS.md
  - PRODUCTION_DEPLOYMENT.md

✅ Modified:
  - bootstrap/app.php (added scheduler)
  - routes/web.php (added webhook route)
  - routes/api.php (added notification endpoints)
  - app/Http/Controllers/DashboardController.php (added unreadNotifications prop)
  - resources/js/pages/dashboard.tsx (added alert for unread notifications)

✅ No Breaking Changes:
  - Existing functionality untouched
  - All new code is additive
  - Can be disabled/rolled back easily
```

---

## 🎯 Expected Behavior After Deployment

1. **Daily at 07:00 UTC (atau sesuai TZ server)**
    - System otomatis cek PostpartumVisit terlewat
    - Create notifikasi untuk admin + midwife terkait
    - Notify via database (bukan email/SMS)

2. **User Experience:**
    - Admin/Bidan login → dashboard menampilkan amber alert
    - Alert: "Anda memiliki X notifikasi jadwal pengisian EPDS terlewat"
    - Click "Lihat detail" → navigate ke `/notifications` page
    - See full list dengan message jelas (misal: "terlewat 3 hari")
    - Click notifikasi → redirect ke postpartum visit detail page

3. **Idempotency:**
    - Jika command jalankan 2x → tidak duplikat notifikasi
    - Safe untuk manual trigger atau multiple cron instances

4. **Scaling:**
    - Database-only, tidak perlu queue worker
    - Cocok untuk shared hosting
    - Minimal resource usage

---

## ⚠️ Important Notes

1. **Backup .env before modifying** untuk production
2. **Test di staging/development first** jika memungkinkan
3. **Setup monitoring/logging** untuk track execution
4. **APP_CRON_SECRET harus random & strong** (gunakan `php artisan str:random 32`)
5. **Keep PRODUCTION_DEPLOYMENT.md accessible** untuk reference troubleshooting

---

## 🚀 Go Live Checklist

- [ ] Code sudah di-commit dan push ke master
- [ ] `.env` updated dengan APP_CRON_SECRET
- [ ] `php artisan migrate` selesai
- [ ] Cron setup (host atau external)
- [ ] `php artisan schedule:list` menampilkan command
- [ ] `npm run build` selesai tanpa error
- [ ] Test command manual: `php artisan notify:missed-epds`
- [ ] Dashboard alert tampil saat ada notifications
- [ ] `/notifications` page accessible
- [ ] Logging/monitoring setup
- [ ] Team informed dan trained

---

**Semua sudah siap untuk production deployment! 🎉**

Lihat `PRODUCTION_DEPLOYMENT.md` untuk step-by-step instructions lengkap.
