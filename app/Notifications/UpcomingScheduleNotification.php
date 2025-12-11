<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpcomingScheduleNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $motherName;
    public $visitLabel;
    public $babyAge;
    public $motherId;

    public function __construct($motherName, $visitLabel, $motherId)
    {
        $this->motherName = $motherName;
        $this->visitLabel = $visitLabel;
        $this->motherId = $motherId;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'title' => "📅 Jadwal Skrining: {$this->visitLabel}",
            'body' => "Ibu {$this->motherName} memasuki periode {$this->visitLabel}).",
            'action_url' => route('postpartum'),
            'type' => 'info',
            'icon' => 'calendar',
        ];
    }
}