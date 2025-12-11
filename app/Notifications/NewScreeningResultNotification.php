<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue; // Wajib Queue agar tidak lemot
use Illuminate\Notifications\Messages\DatabaseMessage;

class NewScreeningResultNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $result;
    protected $patient;

    public function __construct($result, $patient)
    {
        $this->result = $result;
        $this->patient = $patient;
    }

    public function via($notifiable)
    {
        return ['database']; 
    }

    public function toArray($notifiable)
    {
        $score = $this->result->total_score;
        $status = $score >= 13 ? 'BAHAYA' : 'INFO';
        
        return [
            'title' => "Hasil Skrining Baru: {$this->patient->name}",
            'body' => "Skor: {$score}. Status: " . interpreted_score($score),
            'action_url' => "/admin/screening/" . $this->result->id,
            'type' => $status,
            'icon' => $status === 'BAHAYA' ? 'heroicon-o-exclamation-triangle' : 'heroicon-o-check-circle',
        ];
    }
}
