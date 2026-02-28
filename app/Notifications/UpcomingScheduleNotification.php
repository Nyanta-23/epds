<?php

namespace App\Notifications;

use App\Service\FcmService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class UpcomingScheduleNotification extends Notification
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
    $payload = [
      'title' => "Jadwal Skrining: {$this->visitLabel}",
      'body' => "Ibu {$this->motherName} memasuki periode {$this->visitLabel}.",
      'action_url' => route('postpartum'),
      'type' => 'info',
      'icon' => 'calendar',
    ];

    // FCM dikirim synchronous — tidak butuh queue worker (shared hosting safe)
    $this->sendFcm($notifiable, $payload['title'], $payload['body']);

    return $payload;
  }

  /* ── FCM push — dipanggil synchronous dari toArray() ──────────── */

  private function sendFcm(mixed $notifiable, string $title, string $body): void
  {
    if (blank($notifiable->fcm_token)) {
      return;
    }

    app(FcmService::class)->send(
      $notifiable->fcm_token,
      $title,
      $body,
      [
        'action_url' => route('postpartum'),
        'mother_id' => (string) $this->motherId,
        'type' => 'schedule_reminder',
      ]
    );
  }
}
