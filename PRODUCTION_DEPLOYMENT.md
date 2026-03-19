# Production Deployment Checklist: EPDS Notifications

## Checklist Setup Production

### 1. Environment Variables (.env)

```env
# Required untuk notifications
APP_CRON_SECRET=your_random_secret_token_here  # Generate: php artisan str:random 32
```

**Cara generate token:**

```bash
php artisan str:random 32
```

**Contoh .env addition:**

```bash
cat >> .env << 'EOF'

# Notification Cron Secret
APP_CRON_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567
EOF
```

---

### 2. Database Migration

Pastikan `notifications` table sudah ada:

```bash
php artisan migrate
```

Cek table:

```bash
mysql -u YOUR_USER -p YOUR_DB -e "DESC notifications;"
```

Harus ada kolom: `id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`

---

### 3. Cron Setup (Pilih Satu Opsi)

#### Opsi A: Host Cron (Recommended - Jika Host Support)

**Login ke cPanel / Plesk / hosting control panel:**

1. Cari "Cron Jobs" atau "Scheduled Tasks"
2. Tambah new cron entry:
    - **Command:**
        ```
        cd /home/username/public_html/epds && /usr/bin/php artisan schedule:run >> /dev/null 2>&1
        ```
    - **Schedule:** Every minute (`* * * * *`)
3. Save

**Test cron jalan:**

```bash
# SSH ke server, jalankan manual:
php artisan schedule:run

# Cek log recent schedule executions:
tail -f storage/logs/laravel.log | grep "schedule:run"
```

#### Opsi B: External Web Cron (Jika Host TIDAK Support Cron)

Gunakan layanan eksternal seperti:

- **cron-job.org** (Free, reliable)
- **EasyCron** (Free, UI bagus)
- **GitHub Actions** (Free, untuk push events)

**Setup cron-job.org:**

1. Buka https://cron-job.org
2. Login / Register
3. Create New Cron Job:
    - **URL:** `https://yourdomain.com/cron/notify-missed-epds/YOUR_APP_CRON_SECRET`
    - **Schedule:** Daily at 07:00 (atau pilihan lain)
    - **Timeout:** 300 seconds
    - **Save & Enable**

4. Test URL di browser:
    ```
    https://yourdomain.com/cron/notify-missed-epds/YOUR_APP_CRON_SECRET
    ```
    Response (HTTP 200):
    ```json
    {
        "status": "ok",
        "message": "Missed EPDS notification job executed",
        "timestamp": "2026-03-19T07:00:00.000000Z"
    }
    ```

**Jika error 403:** Token tidak sesuai dengan `.env APP_CRON_SECRET`

---

### 4. Verify Scheduler Terdaftar

Jalankan di server:

```bash
php artisan schedule:list
```

Output harus tampil:

```
┌─────┬──────────────────────────────────────────┬─────────────┬──────────┐
│ #   │ Command                                  │ Interval    │ Status   │
├─────┼──────────────────────────────────────────┼─────────────┼──────────┤
│ 0   │ notify:missed-epds                       │ Daily 07:00 │ Due      │
└─────┴──────────────────────────────────────────┴─────────────┴──────────┘
```

---

### 5. Build Frontend Assets

```bash
npm install
npm run build
```

Pastikan tidak ada error dan assets ter-generate di `public/build/`

---

### 6. Verify Notification Controller & Routes

Pastikan route notifications sudah ada:

```bash
php artisan route:list | grep notification
```

Output:

```
GET|HEAD /notifications           ..................... NotificationController@index
POST     /notifications/read-all  ..................... NotificationController@markAllRead
POST     /notifications/{id}/read ..................... NotificationController@markAsRead
```

---

### 7. Test Command di Production

```bash
# SSH ke production server

# Test 1: Run command manual
php artisan notify:missed-epds

# Output: "✓ No missed EPDS schedules found." atau notifikasi dibuat

# Test 2: Trigger schedule manual
php artisan schedule:run

# Output: menjalankan scheduled command
```

---

### 8. Verify Notifications Tersimpan

```bash
php artisan tinker

# Count notifications
DB::table('notifications')->where('type', 'App\Notifications\MissedEpdsNotification')->count();

# Lihat sample
$notif = DB::table('notifications')
  ->where('type', 'App\Notifications\MissedEpdsNotification')
  ->latest()
  ->first();
json_decode($notif->data, true);
```

---

### 9. Monitor & Logging

**Setup log monitoring:**

```bash
# Tail live logs
tail -f storage/logs/laravel.log

# Filter hanya notify:missed-epds
grep "notify:missed-epds" storage/logs/laravel.log

# Atau untuk tanggal tertentu
grep "2026-03-19" storage/logs/laravel.log | grep "missed-epds"
```

**Cek disk space untuk logs:**

```bash
du -sh storage/logs/
```

Jika besar, setup log rotation di `config/logging.php`

---

### 10. Optional: Setup Email Alerts

Jika ingin notifikasi ketika cron gagal jalan, setup monitoring:

**Option A: Cron Monitoring Service**

- **Healthchecks.io** (Free tier ada)
- **Oh Dear** (Premium tapi bagus)

**Option B: Custom logging ke email**
Edit `bootstrap/app.php` untuk log errors:

```php
if ($exitCode != 0) {
  Log::error('notify:missed-epds failed', ['exit_code' => $exitCode]);
  Mail::raw('...', function($m) { $m->to('admin@epds.local'); });
}
```

---

## Verification Checklist

- [ ] `.env` punya `APP_CRON_SECRET`
- [ ] `php artisan migrate` selesai
- [ ] Cron setup (host cron ATAU external cron)
- [ ] `php artisan schedule:list` tampil command
- [ ] `npm run build` selesai tanpa error
- [ ] Routes notification ter-register
- [ ] `php artisan notify:missed-epds` berjalan
- [ ] Notifications tersimpan di database
- [ ] Dashboard menampilkan alert unread count
- [ ] `/notifications` page bisa diakses
- [ ] Log monitoring setup (optional)

---

## Post-Deployment Testing

### Test 1: Full Manual Flow

```bash
# 1. Create test data (PostpartumVisit dengan date kemarin, tanpa Result)
php artisan tinker
$visit = PostpartumVisit::first();
$visit->result?->delete();
$visit->update(['date_filled' => now()->subDays(3)]);
exit

# 2. Run command
php artisan notify:missed-epds

# 3. Check database
php artisan tinker
$admin = User::where('email', 'admin@your-domain.local')->first();
echo $admin->unreadNotifications()->count();
exit

# 4. Open browser
# Go to https://yourdomain.com/dashboard
# Should see amber alert: "Anda memiliki X notifikasi jadwal pengisian kuesioner EPDS yang terlewat"

# 5. Click "Lihat detail"
# Go to https://yourdomain.com/notifications
# Should see notification list dengan title, body, action button
```

### Test 2: Idempotency

```bash
# Run command 2x
php artisan notify:missed-epds
php artisan notify:missed-epds

# Second run harus output: "Completed: 0 created, X skipped"
# Tidak boleh duplicate notification
```

### Test 3: Cron Auto-Trigger

Tunggu sampai jam 07:00 esok hari (atau sesuai schedule), verifikasi:

```bash
# Check log
tail -20 storage/logs/laravel.log | grep "notify:missed-epds"

# Check database (notifikasi seharusnya tambah)
php artisan tinker
DB::table('notifications')
  ->where('type', 'App\Notifications\MissedEpdsNotification')
  ->whereDatetime('created_at', '>=', now()->subHour())
  ->count();
exit
```

---

## Troubleshooting Production

### Cron Tidak Jalan

**Gejala:**

- Log kosong, notifikasi tidak ada
- `schedule:list` sepi

**Solusi:**

```bash
# 1. Verify cron sudah setup di hosting
# Lihat control panel: Cron Jobs

# 2. Test manual
php artisan schedule:run

# 3. Jika error, cek:
php artisan schedule:run -vvv  # verbose mode

# 4. Jika tetap error, gunakan external cron (Opsi B)
```

### Notifications Tidak Muncul di Dashboard

**Gejala:**

- Tidak ada alert di dashboard
- Unread count = 0

**Solusi:**

```bash
# 1. Check database punya data
php artisan tinker
$count = DB::table('notifications')
  ->where('type', 'App\Notifications\MissedEpdsNotification')
  ->count();
echo $count;

# 2. Jika count > 0, cek status read_at
$notif = DB::table('notifications')
  ->where('type', 'App\Notifications\MissedEpdsNotification')
  ->first();
echo $notif->read_at;  // Should be NULL for unread

# 3. Jika read_at tidak null, update:
DB::table('notifications')->update(['read_at' => null]);

# 4. Refresh dashboard page di browser (Ctrl+F5 atau Cmd+Shift+R)
```

### Message Tidak Jelas / Kosong

**Gejala:**

- Notification ada tapi body kosong atau aneh

**Solusi:**

```bash
# Check data structure di database
php artisan tinker
$notif = DB::table('notifications')
  ->where('type', 'App\Notifications\MissedEpdsNotification')
  ->first();
print_r(json_decode($notif->data, true));

# Harus punya: title, body, action_url, type, icon
# Jika tidak ada, re-create:
DB::table('notifications')->where('type', 'App\Notifications\MissedEpdsNotification')->delete();
Artisan::call('notify:missed-epds --force');
```

### External Cron Return 403

**Gejala:**

- Cron-job.org/EasyCron return HTTP 403

**Solusi:**

```bash
# 1. Verify token di .env
cat .env | grep APP_CRON_SECRET

# 2. Copy token, update di external cron URL
# Format: https://domain.com/cron/notify-missed-epds/TOKEN

# 3. Test URL di browser atau curl:
curl -I "https://yourdomain.com/cron/notify-missed-epds/YOUR_SECRET"

# Should return HTTP 200
```

---

## Performance Optimization

Jika ada banyak PostpartumVisit:

```php
// app/Console/Commands/NotifyMissedEpds.php
// Add batch processing:

$batch = 100;
$missed = PostpartumVisit::...->chunk($batch, function($chunk) {
  // Process chunk
});
```

Atau optimize query dengan index:

```sql
-- Add database index untuk mempercepat query
ALTER TABLE postpartum_visits ADD INDEX idx_date_filled (date_filled);
ALTER TABLE postpartum_visits ADD INDEX idx_mother_id (mother_id);
```

---

## Support & Monitoring

**Daily check:**

```bash
# SSH ke production, check:
tail -100 storage/logs/laravel.log | grep "notify:missed-epds"
php artisan tinker -c "echo DB::table('notifications')->where('type', 'App\\Notifications\\MissedEpdsNotification')->whereDate('created_at', today())->count();"
```

**Weekly check:**

- Dashboard alert muncul?
- Notifications page accessible?
- Log file size reasonable?

**Monthly check:**

- Backup notifications table
- Review dan archive old notifications

---

## Rollback / Disable

Jika ada issue dan perlu disable:

```bash
# Disable cron (comment di bootstrap/app.php)
# Edit bootstrap/app.php, hapus/comment withSchedule block

# Delete test data
php artisan tinker
DB::table('notifications')->where('type', 'App\Notifications\MissedEpdsNotification')->delete();
exit

# Reload config cache
php artisan config:cache
php artisan view:clear
```

---

**Selesai! Sistem production-ready. 🚀**

Setiap hari jam 07:00, admin/bidan akan otomatis menerima notifikasi untuk EPDS terlewat.
