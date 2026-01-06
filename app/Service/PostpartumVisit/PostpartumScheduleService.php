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
    // Hitung selisih jam: sekarang - tanggal lahir
    // Jika hasilnya negatif, berarti tanggal lahir di masa depan
    $hoursSinceBirth = $birthDate->diffInHours($now, false);
    $response->birthDate = $latestBaby->date_of_birth;

    // Jika birthDate > now, maka diffInHours akan negatif
    if ($now->lt($birthDate)) {
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

    // Cek kunjungan mana yang sudah diisi
    $kf1Filled = PostpartumVisit::where('mother_id', $motherId)
      ->where('visit_number', 1)
      ->where('baby_id', $latestBaby->id)
      ->exists();

    $kf2Filled = PostpartumVisit::where('mother_id', $motherId)
      ->where('visit_number', 2)
      ->where('baby_id', $latestBaby->id)
      ->exists();

    $kf3Filled = PostpartumVisit::where('mother_id', $motherId)
      ->where('visit_number', 3)
      ->where('baby_id', $latestBaby->id)
      ->exists();

    // Jika masa nifas sudah berakhir (> 42 hari / 1008 jam)
    if ($hoursSinceBirth > 1008) {
      $response->status = 'completed_period';
      $response->message = 'Masa nifas telah berakhir.';
      $response->canFill = false;
      $response->label = 'Selesai';
      $response->nextVisitDate = null;
      return $response;
    }

    // Logika prioritas: Isi kunjungan yang belum diisi, mulai dari KF 1
    // KF 1 belum diisi
    if (!$kf1Filled) {
      $response->visitNumber = 1;
      $response->label = 'Kunjungan Nifas 1 (KF 1)';
      $deadlineDate = $birthDate->copy()->addHours(72);

      // Cek apakah masih dalam periode ideal (6-72 jam)
      if ($hoursSinceBirth >= 6 && $hoursSinceBirth <= 72) {
        $response->status = 'can_fill';
        $response->message = 'Waktunya mengisi Kunjungan Nifas 1 (KF 1).';
        $response->canFill = true;
        $response->nextVisitDate = $deadlineDate->toDateTimeString();
      } else {
        // Sudah lewat periode ideal tapi masih bisa diisi
        $response->status = 'can_fill_late';
        $response->message = 'Periode ideal KF 1 telah lewat, namun Anda masih bisa mengisi.';
        $response->canFill = true;
        $response->nextVisitDate = $deadlineDate->toDateTimeString();
      }
      return $response;
    }

    // KF 1 sudah diisi, KF 2 belum diisi
    if ($kf1Filled && !$kf2Filled) {
      $response->visitNumber = 2;
      $response->label = 'Kunjungan Nifas 2 (KF 2)';
      $kf2StartDate = $birthDate->copy()->addHours(96);
      $deadlineDate = $birthDate->copy()->addHours(672);

      // Belum saatnya KF 2 (masih < 96 jam)
      if ($hoursSinceBirth < 96) {
        $response->status = 'waiting_next_period';
        $response->message = 'Menunggu periode Kunjungan Nifas 2 (KF 2).';
        $response->canFill = false;
        $response->label = 'Menunggu KF 2';
        $response->nextVisitDate = $kf2StartDate->toDateTimeString();
        return $response;
      }

      // Dalam periode ideal KF 2 (96-672 jam)
      if ($hoursSinceBirth >= 96 && $hoursSinceBirth <= 672) {
        $response->status = 'can_fill';
        $response->message = 'Waktunya mengisi Kunjungan Nifas 2 (KF 2).';
        $response->canFill = true;
        $response->nextVisitDate = $deadlineDate->toDateTimeString();
      } else {
        // Sudah lewat periode ideal tapi masih bisa diisi
        $response->status = 'can_fill_late';
        $response->message = 'Periode ideal KF 2 telah lewat, namun Anda masih bisa mengisi.';
        $response->canFill = true;
        $response->nextVisitDate = $deadlineDate->toDateTimeString();
      }
      return $response;
    }

    // KF 1 & 2 sudah diisi, KF 3 belum diisi
    if ($kf1Filled && $kf2Filled && !$kf3Filled) {
      $response->visitNumber = 3;
      $response->label = 'Kunjungan Nifas 3 (KF 3)';
      $kf3StartDate = $birthDate->copy()->addHours(696);
      $deadlineDate = $birthDate->copy()->addHours(1008);

      // Belum saatnya KF 3 (masih < 696 jam)
      if ($hoursSinceBirth < 696) {
        $response->status = 'waiting_next_period';
        $response->message = 'Menunggu periode Kunjungan Nifas 3 (KF 3).';
        $response->canFill = false;
        $response->label = 'Menunggu KF 3';
        $response->nextVisitDate = $kf3StartDate->toDateTimeString();
        return $response;
      }

      // Dalam periode ideal KF 3 (696-1008 jam)
      if ($hoursSinceBirth >= 696 && $hoursSinceBirth <= 1008) {
        $response->status = 'can_fill';
        $response->message = 'Waktunya mengisi Kunjungan Nifas 3 (KF 3).';
        $response->canFill = true;
        $response->nextVisitDate = $deadlineDate->toDateTimeString();
      } else {
        // Sudah lewat periode ideal tapi masih bisa diisi
        $response->status = 'can_fill_late';
        $response->message = 'Periode ideal KF 3 telah lewat, namun Anda masih bisa mengisi.';
        $response->canFill = true;
        $response->nextVisitDate = $deadlineDate->toDateTimeString();
      }
      return $response;
    }

    // Semua kunjungan sudah diisi
    if ($kf1Filled && $kf2Filled && $kf3Filled) {
      $response->status = 'all_completed';
      $response->message = 'Semua kunjungan nifas telah selesai.';
      $response->canFill = false;
      $response->label = 'Selesai';
      $response->nextVisitDate = null;
      return $response;
    }

    // Fallback (seharusnya tidak pernah sampai sini)
    $response->status = 'unknown';
    $response->message = 'Status tidak diketahui.';
    $response->canFill = false;
    $response->label = 'Unknown';
    $response->nextVisitDate = null;
    return $response;
  }
}