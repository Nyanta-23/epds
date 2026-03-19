# Quick Reference: EPDS Notifications Deployment

## 🚀 Fast Track Deployment

### 1. SSH ke Production
```bash
ssh user@your-server.com
cd /home/username/epds  # sesuaikan path
```

### 2. Pull Code
```bash
git pull origin master
composer install --optimize-autoloader --no-dev
npm install && npm run build
```

### 3. Setup Environment
```bash
# Generate token (local)
php artisan str:random 32
# Copy output

# Edit production .env
nano .env
# Tambah: APP_CRON_SECRET=<paste_token_here>
```

### 4. Database
```bash
php artisan migrate
```

### 5. Setup Cron (Pilih Satu)

**Host Cron (cPanel/Plesk):**
```
Command: * * * * * cd /home/user/epds && /usr/bin/php artisan schedule:run >> /dev/null 2>&1
```

**External Cron (cron-job.org):**
```
URL: https://yourdomain.com/cron/notify-missed-epds/YOUR_SECRET
Schedule: Daily 07:00
```

### 6. Cache Clear
```bash
php artisan config:cache
php artisan view:clear
php artisan cache:clear
```

### 7. Verify
```bash
php artisan schedule:list  # Harus tampil notify:missed-epds
php artisan notify:missed-epds  # Test manual
```

---

## ✅ Post-Deployment Checks

```bash
# 1. Check di browser
# https://yourdomain.com/dashboard
# → Should see amber alert if notifications exist

# 2. Check notifications page
# https://yourdomain.com/notifications
# → Should display notification list

# 3. Check database
php artisan tinker
DB::table('notifications')->where('type', 'App\Notifications\MissedEpdsNotification')->count();
# → Should return > 0 if command executed
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Cron tidak jalan | Verifikasi di control panel; gunakan external cron jika tidak support |
| 403 error di cron URL | Verify APP_CRON_SECRET di .env match dengan URL token |
| Alert tidak muncul | Clear browser cache (Ctrl+F5); check database has notifications |
| Duplicate notifications | Run: `php artisan notify:missed-epds` tanpa `--force` flag |
| Message tidak jelas | Rebuild frontend: `npm run build` |

---

## 📞 Support Files

- **Setup guide:** `EPDS_NOTIFICATIONS.md`
- **Deployment checklist:** `PRODUCTION_DEPLOYMENT.md`
- **Implementation details:** `IMPLEMENTATION_SUMMARY.md`

---

## 🔑 Commands Reference

```bash
# Run manually
php artisan notify:missed-epds

# Force re-create (ignore idempotency)
php artisan notify:missed-epds --force

# See scheduled commands
php artisan schedule:list

# Test scheduler
php artisan schedule:run -vvv

# Monitor logs (live)
tail -f storage/logs/laravel.log | grep notify

# Check notifications count
php artisan tinker << 'EOF'
echo DB::table('notifications')->where('type', 'App\Notifications\MissedEpdsNotification')->count();
EOF
```

---

## ⏰ Expected Runtime

- **Migration:** 1-2 detik
- **Build:** 2-5 menit
- **Command execution:** 1-5 detik (depending on data size)
- **Total deployment:** ~10 menit

---

**Deployment time: ~10-15 menit. Minimal downtime. Safe to deploy during business hours.**
