<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewScreeningResultNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $result;
    public $motherName;
    public $postpartumId;

    public function __construct($result, $motherName, $postpartumId)
    {
        $this->result = $result;
        $this->motherName = $motherName;
        $this->postpartumId = $postpartumId;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        $isHighRisk = $this->result->total_score >= 13;

        return [
            'title' => $isHighRisk ? '⚠️ BAHAYA: Pasien Risiko Tinggi' : 'Hasil Skrining Baru',
            'body' => "Ibu {$this->motherName} memiliki skor EPDS: {$this->result->total_score}",
            'action_url' => route('postpartum.show', $this->postpartumId),
            'created_at' => now(),
        ];
    }
}