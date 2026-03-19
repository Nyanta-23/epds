# EPDS Missed Schedule Notifications

Sistem notifikasi otomatis untuk mengingatkan admin/bidan ketika jadwal pengisian kuesioner EPDS sudah terlewat > 1 hari.

## Fitur

- ✅ Deteksi otomatis PostpartumVisit yang `date_filled <= hari kemarin` tanpa Result
- ✅ Notifikasi ke **semua admin + semua bidan** (broadcast notification)
- ✅ Idempotency: tidak ada duplikat notifikasi
- ✅ Disimpan di database (notifications table)
- ✅ API endpoint untuk fetch & mark as read
- ✅ Dashboard badge menampilkan jumlah unread
- ✅ Cocok untuk shared hosting (cron + external webhook fallback)

## 👥 Penerima Notifikasi

Setiap kali ada jadwal EPDS yang terlewat, notifikasi akan dikirim ke:

| Role              | Diterima | Keterangan                                 |
| ----------------- | -------- | ------------------------------------------ |
| **Super Admin**   | ✅ Ya    | Otomatis diberitahu                        |
| **Admin**         | ✅ Ya    | Otomatis diberitahu                        |
| **Midwife**       | ✅ Ya    | **SEMUA** midwife diberitahu (broadcast)   |
| **Patient (Ibu)** | ❌ Tidak | Opsional - bisa diaktifkan jika diperlukan |

**Catatan:** Notifikasi dikirim ke **semua midwife** karena belum ada sistem assignment (siapa midwife yang bertanggung jawab untuk ibu tertentu). Jika Anda ingin membatasi hanya ke midwife yang assigned, silakan implementasikan assignment system terlebih dahulu. Lihat `NOTIFICATION_RECIPIENTS_UPDATE.md` untuk detail lebih lanjut.

## Instalasi

### 1. Setup Environment Variable

Tambah ke `.env`:

```env
APP_CRON_SECRET=your_super_secret_random_token_here
```

Generate token:

```bash
php artisan str:random 32
```

### 2. Jalankan Database Migration (jika belum)

```bash
php artisan migrate
```

Pastikan tabel `notifications` sudah ada.

## Eksekusi

### Opsi A: Host Cron (Recommended untuk Shared Hosting dengan Cron Support)

Jika hosting Anda menyediakan cron access (cPanel, Plesk, dll):

Tambah entry cron di hosting control panel:

```
* * * * * cd /home/username/path/to/app && php artisan schedule:run >> /dev/null 2>&1
```

Jadwal: dijalankan **setiap hari pada pukul 07:00 pagi** (lihat `bootstrap/app.php` → `->withSchedule()`).

Verifikasi cron jalan:

```bash
php artisan schedule:list
```

Lihat output:

```
┌─────┬──────────────────────────────────────────┬─────────────┬──────────┐
│ #   │ Command                                  │ Interval    │ Status   │
├─────┼──────────────────────────────────────────┼─────────────┼──────────┤
│ 0   │ notify:missed-epds                       │ Daily 07:00 │ Due      │
└─────┴──────────────────────────────────────────┴─────────────┴──────────┘
```

### Opsi B: External Web Cron (Backup untuk Shared Hosting tanpa Cron)

Gunakan layanan cron eksternal:

- [cron-job.org](https://cron-job.org) (Free)
- [EasyCron](https://www.easycron.com) (Free)
- GitHub Actions (Free, trigger via webhook)
- AWS CloudWatch Events
- Google Cloud Scheduler

**Setup:**

1. Copy token dari `.env`:

    ```
    APP_CRON_SECRET=abc123def456...
    ```

2. Buat scheduled job di cron service (ambil contoh cron-job.org):
    - **URL:** `https://yourdomain.com/cron/notify-missed-epds/abc123def456...`
    - **Method:** GET
    - **Schedule:** Setiap hari pada jam 07:00 (atau sesuai kebutuhan)

3. Test URL di browser:
    ```
    https://yourdomain.com/cron/notify-missed-epds/abc123def456...
    ```
    Response (should return 200):
    ```json
    {
        "status": "ok",
        "message": "Missed EPDS notification job executed",
        "timestamp": "2026-03-18T07:00:00.000000Z"
    }
    ```

### Opsi C: Manual Command (Testing / On-Demand)

Jalankan command secara manual kapan saja:

```bash
php artisan notify:missed-epds
```

Atau dengan force flag (ignore idempotency, re-create notifikasi):

```bash
php artisan notify:missed-epds --force
```

## Testing Locally

### 1. Setup DB & Seed Data

```bash
php artisan migrate --fresh
php artisan db:seed
```

### 2. Create Test Data (PostpartumVisit tanpa Result)

```bash
php artisan tinker

# Buat visit dengan date_filled kemarin
$mother = \App\Models\User::whereHas('role', fn($q) => $q->where('slug', 'patient'))->first();
$visit = \App\Models\PostpartumVisit::create([
    'mother_id' => $mother->id,
    'baby_id' => $mother->babies->first()->id,
    'visit_number' => 1,
    'date_filled' => now()->subDay(),
    'sleep_quality' => 0,
    'partner_support' => 0,
    'live_with_partner' => true,
    'family_salary_permonth' => 1,
    'dependent_family_count' => 0,
    'is_salary_sufficient' => 1,
    'psych_history' => false,
    'psych_treatment' => false,
    'psych_trauma' => false,
    'parity_count' => '1x',
    'baby_healthy' => 0,
    'baby_caregiver' => [0],
    'feed_type' => 0,
    'last_comp' => false,
    'preg_comp_history' => false,
]);

exit;
```

### 3. Run Command

```bash
php artisan notify:missed-epds
```

Output:

```
Found 1 missed EPDS schedules.
  ✓ Notified Admin User (admin@epds.local) - Visit: uuid-here
Completed: 1 created, 0 skipped.
```

### 4. Verify Notifications Exist

```bash
php artisan tinker

$admin = \App\Models\User::where('email', 'admin@epds.local')->first();
$admin->unreadNotifications()->count();  // should return 1

// Lihat isi notifikasi
$admin->unreadNotifications()->first();
```

### 5. Test API Endpoints

Fetch unread notifications:

```bash
curl -X GET http://localhost:8000/api/v1/notifications \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN"
```

Mark notification as read:

```bash
curl -X POST http://localhost:8000/api/v1/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN"
```

## Frontend Integration

### Dashboard Component

`unreadNotifications` prop sudah dikirim dari `DashboardController`:

```javascript
export default function Dashboard({ unreadNotifications }) {
    return (
        <div>
            {unreadNotifications > 0 && (
                <div className="alert alert-warning">
                    Anda memiliki {unreadNotifications} notifikasi pengingat
                    EPDS terlewat
                </div>
            )}
        </div>
    );
}
```

## Frontend Integration

### Dashboard Component

`unreadNotifications` prop sudah dikirim dari `DashboardController`:

**Alert yang menampilkan count:**

- Dashboard sekarang menampilkan **alert amber** saat ada unread notifications
- Alert menampilkan: "Anda memiliki X notifikasi jadwal pengisian kuesioner EPDS yang terlewat"
- Link "Lihat detail" untuk navigasi ke notifications page

**Notification Structure:**

```javascript
{
  "id": "uuid",
  "type": "warning",           // danger | warning | info
  "icon": "calendar",
  "title": "EPDS Jadwal Terlewat",
  "body": "Kuesioner EPDS untuk Ibu Nama (Bayi) terlewat X hari.",  // atau minggu, bulan
  "action_url": "http://domain/postpartum/uuid",
  "read_at": null,             // atau timestamp jika sudah dibaca
  "created_at_human": "1 jam yang lalu",
  "created_at": "18 Mar 2026 14:30"
}
```

**Message Format Examples:**

- 1 hari terlewat: "Kuesioner EPDS untuk Ibu (Bayi) terlewat 1 hari."
- 3 hari terlewat: "Kuesioner EPDS untuk Ibu (Bayi) terlewat 3 hari."
- 10 hari terlewat: "Kuesioner EPDS untuk Ibu (Bayi) terlewat 1 minggu 3 hari."
- 35 hari terlewat: "Kuesioner EPDS untuk Ibu (Bayi) terlewat 1 bulan 5 hari."
- Belum jatuh tempo: "Kuesioner EPDS untuk Ibu (Bayi) akan segera jatuh tempo."

**Notification Routes:**

- `/notifications` — Halaman daftar notifikasi dengan pagination
- `POST /notifications/{id}/read` — Mark single as read + redirect ke action_url
- `POST /notifications/read-all` — Mark all unread as read

### Notification Bell (Optional - Dapat Ditambahkan)

Untuk polling real-time unread count di navbar, buat komponen:

```typescript
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const res = await fetch('/api/v1/notifications');
      const data = await res.json();
      setUnreadCount(data.unread);
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Poll setiap 30 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <button className="relative p-2">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
```

Tambahkan ke navbar layout untuk real-time notification bell.

## Monitoring & Logging

### Cek Execution History

```bash
# Lihat log recent schedule executions
tail -f storage/logs/laravel.log | grep "notify:missed-epds"
```

### Database Query: Notifikasi Recent

```bash
php artisan tinker

# Last 10 notifications created
\DB::table('notifications')
  ->where('type', 'missed_epds')
  ->orderByDesc('created_at')
  ->take(10)
  ->get();

# Notifications for a specific user
$user = \App\Models\User::where('email', 'admin@epds.local')->first();
$user->notifications()->count();  // total
$user->unreadNotifications()->count();  // unread
```

### Cek Scheduling

```bash
php artisan schedule:list  # Lihat scheduled commands
php artisan schedule:debug  # Lihat next run times
```

## Troubleshooting

### Command Tidak Jalan?

1. **Cek Cron Tidak Setup**
    - Pastikan cron entry sudah di hosting control panel
    - Test: `php artisan schedule:run` di terminal — harusnya execute command

2. **External Cron Webhook Forbidden (403)**
    - Verify token di `.env` APP_CRON_SECRET
    - Pastikan URL encoding token dengan benar (% char mungkin perlu escape)

3. **No Notifications Created**
    - Query: `SELECT * FROM postpartum_visits WHERE date_filled < CURDATE() AND id NOT IN (SELECT postpartum_visit_id FROM results);`
    - Jika kosong, tidak ada EPDS yang terlewat
    - Test dengan create manual data (lihat Testing section)

4. **Duplicate Notifications**
    - Run dengan `--force` flag akan ignore idempotency
    - Tanpa `--force`, sudah ada notifikasi untuk visit → skip

5. **Log Location**
    ```bash
    tail -f storage/logs/laravel.log
    # atau untuk date specific:
    grep "2026-03-18" storage/logs/laravel.log | grep "missed-epds"
    ```

## Configuration

### Ubah Jadwal Notifikasi

Edit `bootstrap/app.php`:

```php
->withSchedule(function ($schedule) {
  // Ubah dari daily 07:00 ke:
  $schedule->command('notify:missed-epds')
    ->dailyAt('09:00')  // 09:00 pagi
    ->onOneServer()
    ->withoutOverlapping();
})
```

Atau gunakan format lain:

```php
->hourly()                   // Setiap jam
->everyFifteenMinutes()     // Setiap 15 menit
->twiceDaily(7, 16)         // Pukul 07:00 dan 16:00
->days([1, 3, 5])           // Monday (1), Wednesday (3), Friday (5)
```

### Ubah Threshold Terlewat

Edit `app/Console/Commands/NotifyMissedEpds.php` line 44:

```php
// Saat ini: terlewat > 1 hari (kemarin)
$today = now()->subDay();

// Ubah ke: terlewat > 3 hari
$today = now()->subDays(3);

// Atau: terlewat tepat lebih dari seminggu
$today = now()->subWeek();
```

### Recipients Notifikasi

Edit method `getNotificationRecipients()` di command untuk customize siapa yang menerima.

---

## Summary

- **Setup Cron:** `* * * * * cd /app && php artisan schedule:run` di hosting
- **Backup:** Public route `/cron/notify-missed-epds/TOKEN` untuk external cron service
- **Test:** `php artisan notify:missed-epds` secara manual
- **Monitor:** Lihat database notifications table dan logs
- **API:** Fetch notifications via `/api/v1/notifications`
- **Frontend:** Dashboard sudah tampil badge dengan `unreadNotifications` count

## Summary

- **Setup Cron:** `* * * * * cd /app && php artisan schedule:run` di hosting
- **Backup:** Public route `/cron/notify-missed-epds/TOKEN` untuk external cron service
- **Test:** `php artisan notify:missed-epds` secara manual
- **Monitor:** Lihat database notifications table dan logs
- **API:** Fetch notifications via `/api/v1/notifications`
- **Frontend:**
    - Dashboard alert menampilkan count unread notifications
    - Notifications page (`/notifications`) menampilkan detail dengan title, body, icon, action button
    - Message yang ditampilkan: "EPDS Jadwal Terlewat" + "Kuesioner EPDS untuk [Ibu] ([Bayi]) telah terlewat X hari"
    - Link "Lihat detail" dari dashboard untuk navigasi ke notifications page full list

---

## ✅ Status Implementasi

- [x] Artisan command `notify:missed-epds` - Selesai
- [x] Notification class dengan data structure yang benar - Selesai
- [x] Scheduler di `bootstrap/app.php` (daily 07:00) - Selesai
- [x] Webhook route untuk external cron - Selesai
- [x] API endpoints untuk fetch notifications - Selesai
- [x] Dashboard alert dengan unread count - Selesai
- [x] Notifications page dengan format yang jelas - Selesai
- [x] Frontend message yang user-friendly - Selesai
- [x] Idempotency (prevent duplicate notifications) - Selesai
- [x] Testing dan dokumentasi lengkap - Selesai

Siap untuk production! 🚀
