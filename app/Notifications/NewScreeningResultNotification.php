<?php

namespace App\Notifications;

use App\Service\FcmService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewScreeningResultNotification extends Notification implements ShouldQueue
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

    return [
      'title' => $isHighRisk ? '⚠️ BAHAYA: Pasien Risiko Tinggi' : 'Hasil Skrining Baru',
      'body' => "Ibu {$this->motherName} memiliki skor EPDS: {$this->result->total_score}",
      'action_url' => route('postpartum.show', $this->postpartumId),
      'type' => $isHighRisk ? 'danger' : 'info',
      'created_at' => now(),
    ];
  }

  /* ── Called by the queue worker after database channel is written ── */

  public function withDelay(mixed $notifiable): int
  {
    return 0;
  }

  /**
   * afterCommit() ensures the DB write is committed before FCM fires.
   * Called automatically by the queue worker for ShouldQueue notifications.
   */
  public function afterSend(mixed $notifiable, string $channel): void
  {
    if ($channel !== 'database')
      return;
    if (blank($notifiable->fcm_token))
      return;

    $isHighRisk = $this->result->total_score >= 13;

    app(FcmService::class)->send(
      $notifiable->fcm_token,
      $isHighRisk ? '⚠️ BAHAYA: Pasien Risiko Tinggi' : 'Hasil Skrining Baru',
      "Ibu {$this->motherName} memiliki skor EPDS: {$this->result->total_score}",
      [
        'action_url' => route('postpartum.show', $this->postpartumId),
        'postpartum_id' => (string) $this->postpartumId,
        'type' => 'screening_result',
      ]
    );
  }
}
