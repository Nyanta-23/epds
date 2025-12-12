<?php

namespace App\Service\PostpartumVisit;

use App\DTO\Response\Postpartum\PostpartumScheduleResponse;
use App\Models\Baby;
use App\Models\PostpartumVisit;
use Carbon\Carbon;
use Log;

class PostpartumScheduleService
{
    public function getScheduleForMother($motherId): PostpartumScheduleResponse
    {
        $response = new PostpartumScheduleResponse();

        $latestBaby = Baby::where('mother_id', $motherId)
            ->orderBy('date_of_birth', 'desc')
            ->first();

        if (!$latestBaby) {
            $response->status = 'no_baby_found';
            $response->message = 'Silahkan lengkapi data bayi terlebih dahulu.';
            $response->canFill = false;
            $response->label = 'Data bayi masih kosong';
            $response->nextVisitDate = null;
            return $response;
        }

        $birthDate = $latestBaby->date_of_birth;
        $now = Carbon::now();
        $hoursSinceBirth = $birthDate->diffInHours($now, false);

        if ($hoursSinceBirth < 0) {
            $response->status = 'invalid_date';
            $response->message = 'Tanggal lahir bayi tidak valid.';
            $response->label = 'Menunggu Jam Lahir';
            $response->canFill = false;
            return $response;
        }

        if ($hoursSinceBirth < 6) {
            $response->status = 'too_early';
            $response->message = 'Skrining baru dapat dilakukan 6 jam pasca salin.';
            $response->canFill = false;
            $response->label = 'Menunggu KF 1';
            $response->nextVisitDate = $birthDate->copy()->addHours(6)->toDateTimeString();
            return $response;
        }

        $currentVisitTarget = 0;
        $deadlineDate = null;
        $nextPhaseStartDate = null;
        $nextVisitLabel = null;

        if ($hoursSinceBirth >= 6 && $hoursSinceBirth <= 72) {
            $currentVisitTarget = 1;
            $response->label = 'Kunjungan Nifas 1 (KF 1)';
            $nextVisitLabel = 'Kunjungan Nifas 2 (KF 2)';

            $deadlineDate = $birthDate->copy()->addHours(72);
            $nextPhaseStartDate = $birthDate->copy()->addHours(72);
        } elseif ($hoursSinceBirth > 72 && $hoursSinceBirth <= 672) {
            $currentVisitTarget = 2;
            $response->label = 'Kunjungan Nifas 2 (KF 2)';
            $nextVisitLabel = 'Kunjungan Nifas 3 (KF 3)';

            $deadlineDate = $birthDate->copy()->addHours(672);
            $nextPhaseStartDate = $birthDate->copy()->addHours(672);
        } elseif ($hoursSinceBirth > 672 && $hoursSinceBirth <= 1008) {
            $currentVisitTarget = 3;
            $response->label = 'Kunjungan Nifas 3 (KF 3)';
            $nextVisitLabel = 'Selesai';

            $deadlineDate = $birthDate->copy()->addHours(1008);
            $nextPhaseStartDate = null;
        } else {
            $response->status = 'completed_period';
            $response->message = 'Masa nifas telah berakhir.';
            $response->canFill = false;
            $response->label = 'Selesai';
            $response->nextVisitDate = null;
            return $response;
        }

        $hasFilled = PostpartumVisit::where('mother_id', $motherId)
            ->where('visit_number', $currentVisitTarget)
            ->where('baby_id', $latestBaby->id)
            ->exists();

        $response->visitNumber = $currentVisitTarget;
        $response->birthDate = $latestBaby->date_of_birth;

        if ($hasFilled) {
            $response->status = 'already_filled';
            $response->message = "Anda sudah mengisi $response->label.";
            $response->canFill = false;
            $response->label = "Menunggu $nextVisitLabel";

            $response->nextVisitLabel = $nextVisitLabel;
            $response->nextVisitDate = $nextPhaseStartDate
                ? $nextPhaseStartDate->toDateTimeString()
                : null;

        } else {
            $response->status = 'can_fill';
            $response->message = "Waktunya mengisi $response->label.";
            $response->canFill = true;

            $response->nextVisitDate = $deadlineDate->toDateTimeString();
        }

        return $response;
    }
}