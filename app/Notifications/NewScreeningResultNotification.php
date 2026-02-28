<?php

namespace App\Notifications;

use App\Service\FcmService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewScreeningResultNotification extends Notification
{
  use Queueable;

  public function __construct(
    public readonly mixed $result,
    public readonly string $motherName,
    public readonly mixed $postpartumId,
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
    $isHighRisk = $this->result->total_score >= 13;

    $payload = [
      'title' => $isHighRisk ? '⚠️ BAHAYA: Pasien Risiko Tinggi' : 'Hasil Skrining Baru',
      'body' => "Ibu {$this->motherName} memiliki skor EPDS: {$this->result->total_score}",
      'action_url' => route('postpartum.show', $this->postpartumId),
      'type' => $isHighRisk ? 'danger' : 'info',
      'created_at' => now(),
    ];

    // FCM dikirim synchronous — tidak butuh queue worker (shared hosting safe)
    $this->sendFcm($notifiable, $isHighRisk, $payload['title'], $payload['body']);

    return $payload;
  }

  /* ── FCM push — dipanggil synchronous dari toArray() ──────────── */

  private function sendFcm(mixed $notifiable, bool $isHighRisk, string $title, string $body): void
  {
    if (blank($notifiable->fcm_token)) {
      return;
    }

    app(FcmService::class)->send(
      $notifiable->fcm_token,
      $title,
      $body,
      [
        'action_url' => route('postpartum.show', $this->postpartumId),
        'postpartum_id' => (string) $this->postpartumId,
        'type' => 'screening_result',
      ]
    );
  }
}
