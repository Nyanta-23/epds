<?php

namespace App\Service\PostpartumVisit;

use App\DTO\Response\Postpartum\PostpartumScheduleResponse;
use App\Models\Baby;
use App\Models\PostpartumVisit;
use Carbon\Carbon;

class PostpartumScheduleService
{
  private const VISIT_WINDOWS = [
    1 => ['start_hours' => 6, 'end_hours' => 48, 'label' => 'Kunjungan Nifas 1 (KF 1)'],
    2 => ['start_hours' => 48, 'end_hours' => 168, 'label' => 'Kunjungan Nifas 2 (KF 2)'],
    3 => ['start_hours' => 168, 'end_hours' => 672, 'label' => 'Kunjungan Nifas 3 (KF 3)'],
    4 => ['start_hours' => 672, 'end_hours' => 1008, 'label' => 'Kunjungan Nifas 4 (KF 4)'],
  ];

  public function getScheduleForMother(string $motherId): PostpartumScheduleResponse
  {
    $response = new PostpartumScheduleResponse();

    $latestBaby = Baby::where('mother_id', $motherId)
      ->orderByDesc('date_of_birth')
      ->first();

    if (!$latestBaby) {
      $response->status = 'no_baby_found';
      $response->message = 'Silahkan lengkapi data bayi terlebih dahulu.';
      $response->canFill = false;
      $response->label = 'Data bayi masih kosong';
      $response->nextVisitDate = null;
      return $response;
    }

    $birthDate = Carbon::parse($latestBaby->date_of_birth);
    $now = Carbon::now($birthDate->timezone);
    $response->birthDate = $latestBaby->date_of_birth;

    if ($now->lt($birthDate)) {
      $response->status = 'invalid_date';
      $response->message = 'Tanggal lahir bayi tidak valid.';
      $response->label = 'Menunggu Jam Lahir';
      $response->canFill = false;
      $response->nextVisitDate = null;
      return $response;
    }

    $kf1Start = $birthDate->copy()->addHours(self::VISIT_WINDOWS[1]['start_hours']);
    if ($now->lt($kf1Start)) {
      $response->status = 'too_early';
      $response->message = 'Skrining baru dapat dilakukan 6 jam pasca salin.';
      $response->canFill = false;
      $response->label = 'Menunggu KF 1';
      $response->nextVisitDate = $kf1Start->toDateTimeString();
      return $response;
    }

    $postpartumEnd = $birthDate->copy()->addHours(self::VISIT_WINDOWS[4]['end_hours']);
    if ($now->gt($postpartumEnd)) {
      $response->status = 'completed_period';
      $response->message = 'Masa nifas (42 hari) telah berakhir.';
      $response->canFill = false;
      $response->label = 'Selesai';
      $response->nextVisitDate = null;
      return $response;
    }

    // 1 query untuk mengambil seluruh visit_number yang sudah diisi pada bayi ini
    $filledVisits = PostpartumVisit::where('mother_id', $motherId)
      ->where('baby_id', $latestBaby->id)
      ->pluck('visit_number')
      ->map(fn($num) => (int) $num)
      ->all();

    foreach (self::VISIT_WINDOWS as $visitNumber => $window) {
      $windowStart = $birthDate->copy()->addHours($window['start_hours']);
      $windowEnd = $birthDate->copy()->addHours($window['end_hours']);

      // KF 1 inklusif di batas awal (>= 6 jam), KF 2-4 eksklusif (> batas akhir KF sebelumnya)
      $inWindow = ($visitNumber === 1)
        ? ($now->gte($windowStart) && $now->lte($windowEnd))
        : ($now->gt($windowStart) && $now->lte($windowEnd));

      if (!$inWindow) {
        continue;
      }

      $response->visitNumber = $visitNumber;

      // Kunjungan untuk periode berjalan belum diisi -> izinkan pengisian
      if (!in_array($visitNumber, $filledVisits, true)) {
        $response->status = 'can_fill';
        $response->message = "Waktunya mengisi {$window['label']}.";
        $response->canFill = true;
        $response->label = $window['label'];
        $response->nextVisitDate = $windowEnd->toDateTimeString();
        return $response;
      }

      // Kunjungan periode berjalan sudah diisi -> arahkan ke jadwal periode berikutnya
      $nextVisitNumber = $visitNumber + 1;
      if (isset(self::VISIT_WINDOWS[$nextVisitNumber])) {
        $nextStart = $birthDate->copy()->addHours(self::VISIT_WINDOWS[$nextVisitNumber]['start_hours']);

        $response->status = 'waiting_next_period';
        $response->message = "Kunjungan ini sudah diisi. Menunggu periode Kunjungan Nifas {$nextVisitNumber} (KF {$nextVisitNumber}).";
        $response->canFill = false;
        $response->label = "Menunggu KF {$nextVisitNumber}";
        $response->nextVisitDate = $nextStart->toDateTimeString();
        return $response;
      }
    }

    // Berada di rentang KF 4 (hari ke-29 s/d 42) dan KF 4 sudah terisi
    $response->status = 'all_completed';
    $response->message = 'Semua kunjungan nifas (KF 1 – KF 4) telah selesai.';
    $response->canFill = false;
    $response->label = 'Selesai';
    $response->nextVisitDate = null;

    return $response;
  }
}