<?php

namespace App\Console\Commands;

use App\Service\PostpartumVisit\PostpartumScheduleService;
use Illuminate\Console\Command;
use App\Models\Baby;
use App\Models\User;
use App\Notifications\UpcomingScheduleNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

class CheckEpdsSchedule extends Command
{
    protected $signature = 'epds:check-schedule';
    protected $description = 'Cek jadwal nifas dan notifikasi bidan';

    public function handle()
    {
        $this->info('Memulai pengecekan jadwal...');
        
        $babies = Baby::with('mother')->where('date_of_birth', '>=', now()->subDays(45))->get();

        foreach ($babies as $baby) {

           $response = app(PostpartumScheduleService::class)->getScheduleForMother($baby->mother_id);
            
            if ($response->canFill) {
                $this->sendNotification($baby, $response->label, $response->visitNumber);
            }
        }
        
        $this->info('Selesai.');
    }

    private function sendNotification($baby, $label, $daysAge)
    {

        $mother = $baby->mother;
        if (!$mother) return;

        $midwives = User::where('role', 'midwife')
            ->where(function($q) use ($mother) {
                $q->where('village_id', $mother->village_id) 
                  ->orWhere('district_id', $mother->district_id);
            })
            ->get();
            
        $ageString = $daysAge < 1 ? "Baru Lahir" : "$daysAge Hari";

        Notification::send($midwives, new UpcomingScheduleNotification(
            $mother->name, 
            $label, 
            $mother->id
        ));
        
        $this->info("Notif $label dikirim untuk ibu: {$mother->name}");
    }
}