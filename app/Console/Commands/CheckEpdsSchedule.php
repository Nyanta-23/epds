<?php

namespace App\Console\Commands;

use App\Models\Baby;
use App\Models\User;
use App\Notifications\PatientScheduleNotification;
use App\Notifications\UpcomingScheduleNotification;
use App\Service\FcmService;
use App\Service\PostpartumVisit\PostpartumScheduleService;
use Illuminate\Console\Command;
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
                $this->sendPatientNotification($baby, $response->label, $response->visitNumber);
            }
        }

        $this->info('Selesai.');
    }

    private function sendNotification($baby, $label, $daysAge)
    {

        $mother = $baby->mother;
        if (! $mother) {
            return;
        }

        // Cegah spam: cek apakah notifikasi (untuk ibu dan jenis kunjungan ini) sudah pernah dikirim.
        $alreadySent = \Illuminate\Support\Facades\DB::table('notifications')
            ->where('type', UpcomingScheduleNotification::class)
            ->where(function ($q) use ($mother, $label) {
                $q->where(function ($sub) use ($mother) {
                    $sub->where('data', 'like', '%"mother_id":'.$mother->id.'%')
                        ->orWhere('data', 'like', '%"mother_id":"'.$mother->id.'"%');
                })->where('data', 'like', '%"visit_label":"'.$label.'"%')
                    ->orWhere(function ($sub) use ($mother, $label) {
                        // Cek kompatibilitas mundur untuk notif lama yang datanya masih sebatas judul & pesan
                        $sub->where('data', 'like', '%Jadwal Skrining: '.$label.'%')
                            ->where('data', 'like', '%Ibu '.$mother->name.' memasuki%');
                    });
            })
            ->exists();

        if ($alreadySent) {
            return; // Langsung kembali jika notif sudah pernah dikirim
        }

        $midwives = User::whereHas('role', fn ($q) => $q->where('slug', 'midwife'))->get();

        Notification::send($midwives, new UpcomingScheduleNotification(
            $mother->name,
            $label,
            $mother->id
        ));

        $this->info("Notif $label dikirim untuk ibu: {$mother->name}");
    }

    private function sendPatientNotification(Baby $baby, ?string $label, ?int $visitNumber): void
    {
        $mother = $baby->mother;

        if (! $mother || ! $label || ! $visitNumber) {
            return;
        }

        $alreadySent = $mother->notifications()
            ->where('type', PatientScheduleNotification::class)
            ->whereJsonContains('data->baby_id', $baby->id)
            ->whereJsonContains('data->visit_number', $visitNumber)
            ->exists();

        if ($alreadySent) {
            return;
        }

        $mother->notify(new PatientScheduleNotification($baby->id, $visitNumber, $label));

        if ($mother->webPushSubscriptions()->exists()) {
            app(FcmService::class)->sendHighUrgencyWebPush(
                $mother,
                'Jadwal Skrining Tersedia',
                "{$label} sudah dapat diisi. Lengkapi skrining EPDS Anda.",
                '/patient-app',
                [
                    'type' => 'schedule',
                    'baby_id' => $baby->id,
                    'visit_number' => $visitNumber,
                    'action_url' => '/patient-app',
                ]
            );
        }
    }
}
