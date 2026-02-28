<?php

namespace App\Notifications;

use App\Service\FcmService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class UpcomingScheduleNotification extends Notification implements ShouldQueue
{
  use Queueable;

  public function __construct(
    public readonly string $motherName,
    public readonly string $visitLabel,
    public readonly mixed $motherId,
  ) {
  }

  /* ── Channels ──────────────────────────────────────────────────── */

  public function via(mixed $notifiable): array
  {
    return ['database'];
  }

  /* ── Database channel (in-app bell) ────────────────────────────── */

  public function toArray(mixed $notifiable): array
  {
    return [
      'title' => "Jadwal Skrining: {$this->visitLabel}",
      'body' => "Ibu {$this->motherName} memasuki periode {$this->visitLabel}.",
      'action_url' => route('postpartum'),
      'type' => 'info',
      'icon' => 'calendar',
    ];
  }

  /* ── Firebase push — called after database channel is written ──── */

  public function afterSend(mixed $notifiable, string $channel): void
  {
    if ($channel !== 'database')
      return;
    if (blank($notifiable->fcm_token))
      return;

    app(FcmService::class)->send(
      $notifiable->fcm_token,
      "Jadwal Skrining: {$this->visitLabel}",
      "Ibu {$this->motherName} memasuki periode {$this->visitLabel}.",
      [
        'action_url' => route('postpartum'),
        'mother_id' => (string) $this->motherId,
        'type' => 'schedule_reminder',
      ]
    );
  }
}
