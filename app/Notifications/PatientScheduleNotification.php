<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PatientScheduleNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $babyId,
        public int $visitNumber,
        public string $visitLabel
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Jadwal Skrining Tersedia',
            'body' => "{$this->visitLabel} sudah dapat diisi. Lengkapi skrining EPDS Anda.",
            'action_url' => '/patient-app',
            'type' => 'schedule',
            'icon' => 'calendar',
            'baby_id' => $this->babyId,
            'visit_number' => $this->visitNumber,
            'visit_label' => $this->visitLabel,
        ];
    }
}
