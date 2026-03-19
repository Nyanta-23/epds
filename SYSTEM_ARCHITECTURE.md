# EPDS Notifications System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DAILY NOTIFICATION CYCLE                         │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                              TRIGGER (07:00)                             │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Option A: Host Cron                                                │  │
│  │   * * * * * php artisan schedule:run                              │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Option B: External Cron (cron-job.org / EasyCron)                │  │
│  │   GET /cron/notify-missed-epds/{TOKEN}                            │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    ARTISAN COMMAND EXECUTION                             │
│   php artisan notify:missed-epds                                         │
│                                                                          │
│  1. Query: PostpartumVisit with date_filled <= yesterday AND no Result  │
│  2. Get recipients: Admin + Midwife yang bertanggung jawab              │
│  3. Create notifications di database                                    │
│  4. Mark as unread (read_at = NULL)                                     │
└──────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          DATABASE STORAGE                                │
│  notifications table                                                     │
│  ┌─────────┬──────────────────────────────────────────────────────────┐  │
│  │ Field   │ Value                                                    │  │
│  ├─────────┼──────────────────────────────────────────────────────────┤  │
│  │ type    │ App\Notifications\MissedEpdsNotification                │  │
│  │ data    │ {                                                        │  │
│  │         │   "title": "EPDS Jadwal Terlewat",                     │  │
│  │         │   "body": "Kuesioner EPDS untuk... terlewat 3 hari",   │  │
│  │         │   "action_url": "/postpartum/uuid",                    │  │
│  │         │   "type": "warning",                                   │  │
│  │         │   "icon": "calendar"                                   │  │
│  │         │ }                                                        │  │
│  │ read_at │ NULL (unread)                                           │  │
│  └─────────┴──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER FACING FRONTEND                             │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Dashboard (/dashboard)                                          │   │
│  │                                                                 │   │
│  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│  │  ┃ 🔔 Notifikasi Pengingat EPDS                            ┃   │
│  │  ┃ Anda memiliki 2 notifikasi jadwal pengisian kuesioner   ┃   │
│  │  ┃ EPDS yang terlewat. [Lihat detail]                     ┃   │
│  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
│  │                                                                 │   │
│  │  [Rest of dashboard content...]                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Notifications Page (/notifications)                             │   │
│  │                                                                 │   │
│  │  📋 Riwayat Notifikasi                    [Tandai semua dibaca] │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │   │
│  │                                                                 │   │
│  │  ☐ 🔔 EPDS Jadwal Terlewat                        1 jam lalu  │   │
│  │     Kuesioner EPDS untuk Ibu Erina (Bayi) terlewat 3 hari.   │   │
│  │     [Lihat]                                                    │   │
│  │                                                                 │   │
│  │  ☐ 🔔 EPDS Jadwal Terlewat                        3 jam lalu  │   │
│  │     Kuesioner EPDS untuk Ibu Siti (Bayi) terlewat 1 minggu.  │   │
│  │     [Lihat]                                                    │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER ACTION: CLICK                               │
│  Click "Lihat" → Mark notifikasi as read → Navigate ke postpartum page  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
PostpartumVisit Model
    ↓
    ├─ date_filled: 2026-03-16 (past)
    ├─ result: NULL (belum ada)
    ├─ mother: Ibu Erina
    └─ baby: Bayi

            ↓ COMMAND: NotifyMissedEpds

Query Builder
    ├─ whereDate('date_filled', '<=', yesterday)
    ├─ whereDoesntHave('result')
    └─ with(['mother', 'baby'])

            ↓ FOR EACH VISIT

Get Recipients
    ├─ Super Admin
    ├─ Admin
    └─ Assigned Midwife

            ↓ FOR EACH RECIPIENT

Create MissedEpdsNotification
    ├─ Input: PostpartumVisit + Recipient User
    ├─ Process:
    │   ├─ Calculate daysOverdue (abs diff)
    │   ├─ Format: "terlewat 3 hari" / "terlewat 1 minggu 2 hari" / dll
    │   └─ Build message: "Kuesioner EPDS untuk {mother} ({baby}) {time_msg}"
    └─ Output: DatabaseMessage with structured data

            ↓ NOTIFICATION CHANNEL

Database (notifications table)
    ├─ Column: type → App\Notifications\MissedEpdsNotification
    ├─ Column: data → JSON with title, body, action_url, icon, etc
    ├─ Column: read_at → NULL (unread)
    └─ Column: notifiable_id → User ID

            ↓ FRONTEND

User::unreadNotifications()
    ├─ Query: WHERE read_at IS NULL
    ├─ Return: Collection of unread notifications
    └─ Display: Dashboard alert + Notifications page list

            ↓ USER INTERACTION

User reads notification
    ├─ Click "Lihat detail"
    ├─ Mark as read (UPDATE read_at = timestamp)
    └─ Navigate to postpartum visit page
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  PRODUCTION SERVER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Cron Job / External Trigger                               │   │
│  │                                                            │   │
│  │ Option A: Host Cron (cPanel/Plesk)                        │   │
│  │   * * * * * /usr/bin/php artisan schedule:run             │   │
│  │                                                            │   │
│  │ Option B: External Service (cron-job.org)                 │   │
│  │   GET /cron/notify-missed-epds/{TOKEN}                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Laravel Application                                       │   │
│  │  ├─ bootstrap/app.php → withSchedule()                   │   │
│  │  ├─ app/Console/Commands/NotifyMissedEpds.php            │   │
│  │  └─ app/Notifications/MissedEpdsNotification.php          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Database (MySQL/MariaDB)                                  │   │
│  │  ├─ notifications table                                   │   │
│  │  └─ postpartum_visits table                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Web Server (Nginx/Apache)                                │   │
│  │  ├─ routes/web.php → /notifications page                 │   │
│  │  ├─ routes/api.php → /api/v1/notifications               │   │
│  │  └─ Front-end React/Inertia SPA                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Browser (User)                                            │   │
│  │  ├─ Dashboard: Alert with unread count                   │   │
│  │  └─ /notifications: Full notification list                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
epds/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── NotifyMissedEpds.php ✨ NEW
│   ├── Notifications/
│   │   └── MissedEpdsNotification.php ✨ NEW
│   └── Http/
│       └── Controllers/
│           └── DashboardController.php (modified)
├── bootstrap/
│   └── app.php (modified - added withSchedule)
├── routes/
│   ├── web.php (modified - added webhook route)
│   └── api.php (modified - added notification endpoints)
├── resources/
│   └── js/
│       └── pages/
│           └── dashboard.tsx (modified - added alert)
├── EPDS_NOTIFICATIONS.md ✨ NEW
├── PRODUCTION_DEPLOYMENT.md ✨ NEW
├── IMPLEMENTATION_SUMMARY.md ✨ NEW
└── QUICK_DEPLOY.md ✨ NEW
```

---

## Idempotency & Safety

```
EXECUTION 1:
  ├─ Check: PostpartumVisit where date_filled <= yesterday
  ├─ Found: 5 visits
  ├─ Check: Existing notifications?
  │   └─ Not found (first time)
  └─ Create: 5 notifications

EXECUTION 2 (same day, same visit):
  ├─ Check: PostpartumVisit where date_filled <= yesterday
  ├─ Found: 5 visits (same)
  ├─ Check: Existing notifications?
  │   ├─ For each visit, query:
  │   │   WHERE type = MissedEpdsNotification
  │   │   AND notifiable_id = admin_id
  │   │   AND data->postpartum_visit_id = visit.id
  │   └─ Found: 1 (already created)
  └─ Skip: Don't create duplicate

RESULT: 0 created, 5 skipped
```

---

## Timeline Estimate

| Task         | Duration      | Notes                         |
| ------------ | ------------- | ----------------------------- |
| Pull code    | 1 min         | git pull origin master        |
| Composer/NPM | 3-5 min       | composer install, npm install |
| Build        | 2-3 min       | npm run build                 |
| Migration    | 1 min         | php artisan migrate           |
| Cron setup   | 2-5 min       | Depends on host control panel |
| Verification | 3-5 min       | Manual tests                  |
| **Total**    | **10-15 min** | Safe for business hours       |

---

**System is production-ready and optimized for shared hosting environments.**
