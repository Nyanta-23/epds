<?php

namespace App\Notifications;

use App\Models\PostpartumVisit;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class MissedEpdsNotification extends Notification
{
  public function __construct(public PostpartumVisit $visit)
  {
  }

  public function via(object $notifiable): array
  {
    // Store in database, don't send email
    return ['database'];
  }

  public function toDatabase(object $notifiable): DatabaseMessage
  {
    // Calculate days overdue (positive = past, negative = future)
    $visitDate = \Carbon\Carbon::parse($this->visit->date_filled);
    $daysOverdue = abs(now()->diffInDays($visitDate));
    $isPast = $visitDate->lessThan(now());

    $motherName = $this->visit->mother?->name ?? 'Unknown';
    $babyName = $this->visit->baby?->name ?? 'Bayi';

    // Format message dengan waktu yang jelas
    $timeMsg = $this->formatTimeMessage($daysOverdue, $isPast);

    return new DatabaseMessage(
      [
        'title' => 'EPDS Jadwal Terlewat',
        'body' => "Kuesioner EPDS untuk {$motherName} ({$babyName}) {$timeMsg}",
        'action_url' => route('postpartum.show', $this->visit->id),
        'type' => 'warning',
        'icon' => 'calendar',
        'postpartum_visit_id' => $this->visit->id,
        'mother_name' => $motherName,
        'baby_name' => $babyName,
        'days_overdue' => $daysOverdue,
      ]
    );
  }

  /**
   * Format waktu terlewat menjadi pesan yang mudah dibaca
   */
  private function formatTimeMessage(int $daysOverdue, bool $isPast): string
  {
    if (!$isPast) {
      return 'akan segera jatuh tempo.';
    }

    if ($daysOverdue == 1) {
      return 'terlewat 1 hari.';
    }

    if ($daysOverdue < 7) {
      return "terlewat {$daysOverdue} hari.";
    }

    if ($daysOverdue < 30) {
      $weeks = intdiv($daysOverdue, 7);
      $days = $daysOverdue % 7;
      if ($days == 0) {
        return "terlewat {$weeks} minggu.";
      }
      return "terlewat {$weeks} minggu {$days} hari.";
    }

    $months = intdiv($daysOverdue, 30);
    $days = $daysOverdue % 30;
    if ($days == 0) {
      return "terlewat {$months} bulan.";
    }
    return "terlewat {$months} bulan {$days} hari.";
  }
}
