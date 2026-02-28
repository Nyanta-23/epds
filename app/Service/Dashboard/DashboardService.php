<?php

namespace App\Service\Dashboard;

use App\Models\PostpartumVisit;
use App\Models\Followup;
use App\Models\User;
use Carbon\Carbon;

class DashboardService
{
  /**
   * Grafik Harian — setiap hari dalam rentang $from..$to (maks 90 titik).
   */
  public function postpartumScreeningLineDay(Carbon $from, Carbon $to): array
  {
    $data = PostpartumVisit::selectRaw('DATE(date_filled) as date, count(*) as total')
      ->whereBetween('date_filled', [$from, $to])
      ->groupBy('date')
      ->pluck('total', 'date');

    $results = [];
    $current = $from->copy()->startOfDay();
    $end = $to->copy()->startOfDay();
    $limit = 90; // cap agar chart tidak terlalu padat
    $step = max(1, (int) ceil($current->diffInDays($end) / $limit));

    while ($current->lte($end)) {
      $dateString = $current->toDateString();
      $results[] = [
        'day' => $current->format('l'),
        'date' => $dateString,
        'total' => (int) ($data[$dateString] ?? 0),
      ];
      $current->addDays($step);
    }

    return $results;
  }

  /**
   * Grafik Mingguan — setiap minggu dalam rentang $from..$to.
   */
  public function postpartumScreeningLineWeekly(Carbon $from, Carbon $to): array
  {
    $results = [];
    $current = $from->copy()->startOfWeek();
    $weekNum = 1;

    while ($current->lte($to)) {
      $start = $current->copy();
      $end = $current->copy()->endOfWeek();

      $count = PostpartumVisit::whereBetween('date_filled', [
        $start->toDateString(),
        $end->toDateString(),
      ])->count();

      $results[] = [
        'week' => 'Week ' . $weekNum,
        'start' => $start->toDateString(),
        'end' => $end->toDateString(),
        'total' => $count,
      ];

      $current->addWeek();
      $weekNum++;
    }

    return $results ?: [
      [
        'week' => 'Week 1',
        'start' => $from->toDateString(),
        'end' => $to->toDateString(),
        'total' => 0,
      ]
    ];
  }

  /**
   * Grafik Bulanan — setiap bulan dalam rentang $from..$to.
   */
  public function postpartumScreeningLineMonth(Carbon $from, Carbon $to): array
  {
    $startDate = $from->copy()->startOfMonth();

    $data = PostpartumVisit::selectRaw('YEAR(date_filled) as year, MONTH(date_filled) as month, count(*) as total')
      ->whereBetween('date_filled', [$from, $to])
      ->groupBy('year', 'month')
      ->get()
      ->mapWithKeys(function ($item) {
        return [$item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT) => $item->total];
      });

    $results = [];
    $current = $startDate->copy();
    $end = $to->copy()->startOfMonth();

    while ($current->lte($end)) {
      $key = $current->format('Y-m');
      $results[] = [
        'month' => $current->format('F'),
        'year' => $current->year,
        'total' => (int) ($data[$key] ?? 0),
      ];
      $current->addMonth();
    }

    return $results ?: [
      [
        'month' => $from->format('F'),
        'year' => $from->year,
        'total' => 0,
      ]
    ];
  }

  /**
   * Statistik Follow Up dalam rentang $from..$to.
   */
  public function followUpStats(Carbon $from, Carbon $to): array
  {
    $totalVisits = PostpartumVisit::whereBetween('date_filled', [$from, $to])->count();
    $totalFollowUp = Followup::whereBetween('created_at', [$from, $to])->count();

    if ($totalVisits === 0) {
      return [
        'follow_up' => ['label' => 'Sudah Follow Up', 'data' => 0, 'count' => 0],
        'unfollow_up' => ['label' => 'Belum Follow Up', 'data' => 0, 'count' => 0],
      ];
    }

    $pct = ($totalFollowUp / $totalVisits) * 100;

    return [
      'follow_up' => ['label' => 'Sudah Follow Up', 'data' => round($pct), 'count' => $totalFollowUp],
      'unfollow_up' => ['label' => 'Belum Follow Up', 'data' => round(100 - $pct), 'count' => $totalVisits - $totalFollowUp],
    ];
  }

  /**
   * Distribusi Risiko dalam rentang $from..$to.
   */
  public function riskDistribution(Carbon $from, Carbon $to): array
  {
    $visits = PostpartumVisit::with('result:id,postpartum_visit_id,total_score')
      ->whereBetween('date_filled', [$from, $to])
      ->get();

    $stats = ['Normal' => 0, 'Low Risk' => 0, 'High Risk' => 0];

    foreach ($visits as $visit) {
      if (!$visit->result)
        continue;
      $category = category_score($visit->result->total_score);
      isset($stats[$category]) ? $stats[$category]++ : $stats['High Risk']++;
    }

    return [
      ['label' => 'Normal', 'value' => $stats['Normal']],
      ['label' => 'Low Risk', 'value' => $stats['Low Risk']],
      ['label' => 'High Risk', 'value' => $stats['High Risk']],
    ];
  }

  /**
   * Data terbaru dalam rentang $from..$to, opsional filter risiko.
   */
  public function latestPostpartumData(Carbon $from, Carbon $to, string $riskType = 'all'): array
  {
    $visits = PostpartumVisit::with(['mother', 'result'])
      ->whereBetween('date_filled', [$from, $to])
      ->latest('created_at')
      ->take(10)
      ->get();

    $mapped = $visits->map(function ($visit) {
      return [
        'id' => $visit->id,
        'number_patient' => $visit->mother?->number_patient ?? '-',
        'name' => $visit->mother?->name ?? 'Unknown',
        'date_filled' => $visit->date_filled,
        'risk' => $visit->result
          ? category_score($visit->result->total_score)
          : 'No Result',
      ];
    });

    // Apply risk filter in memory (avoids join complexity)
    if ($riskType !== 'all') {
      $mapped = $mapped->filter(function ($item) use ($riskType) {
        $lower = strtolower($item['risk']);
        return match ($riskType) {
          'high' => str_contains($lower, 'high'),
          'low' => str_contains($lower, 'low'),
          'normal' => str_contains($lower, 'normal'),
          default => true,
        };
      });
    }

    return $mapped->values()->toArray();
  }

  /**
   * Summary statistics untuk stat-card row, dalam rentang $from..$to.
   */
  public function summaryStats(Carbon $from, Carbon $to): array
  {
    // ── Totals within range ───────────────────────────────────────
    $totalPatients = User::whereHas('role', fn($q) => $q->where('slug', 'patient'))
      ->whereBetween('created_at', [$from, $to])
      ->count();
    $totalScreenings = PostpartumVisit::whereBetween('date_filled', [$from, $to])->count();
    $totalFollowups = Followup::whereBetween('created_at', [$from, $to])->count();
    $totalHighRisk = PostpartumVisit::with('result')
      ->whereBetween('date_filled', [$from, $to])
      ->get()
      ->filter(fn($v) => $v->result && category_score($v->result->total_score) === 'High Risk')
      ->count();

    // ── Sparklines: split range into 7 equal buckets ─────────────
    $days = max(1, $from->diffInDays($to));
    $bucket = max(1, (int) ceil($days / 7));

    $screeningRaw = PostpartumVisit::selectRaw('DATE(date_filled) as date, count(*) as total')
      ->whereBetween('date_filled', [$from, $to])
      ->groupBy('date')->pluck('total', 'date');

    $followupRaw = Followup::selectRaw('DATE(created_at) as date, count(*) as total')
      ->whereBetween('created_at', [$from, $to])
      ->groupBy('date')->pluck('total', 'date');

    $patientRaw = User::selectRaw('DATE(created_at) as date, count(*) as total')
      ->whereHas('role', fn($q) => $q->where('slug', 'patient'))
      ->whereBetween('created_at', [$from, $to])
      ->groupBy('date')->pluck('total', 'date');

    $highRiskRaw = PostpartumVisit::with('result')
      ->whereBetween('date_filled', [$from, $to])
      ->get()
      ->groupBy(fn($v) => substr((string) $v->date_filled, 0, 10));

    $sparkScreening = $sparkFollowup = $sparkPatient = $sparkHighRisk = [];

    for ($i = 0; $i < 7; $i++) {
      $start = $from->copy()->addDays($i * $bucket);
      $end = $from->copy()->addDays(($i + 1) * $bucket - 1);

      $sSum = $fSum = $pSum = $hSum = 0;
      for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
        $key = $d->toDateString();
        $sSum += (int) ($screeningRaw[$key] ?? 0);
        $fSum += (int) ($followupRaw[$key] ?? 0);
        $pSum += (int) ($patientRaw[$key] ?? 0);
        $day = $highRiskRaw[$key] ?? collect();
        $hSum += $day->filter(fn($v) => $v->result && category_score($v->result->total_score) === 'High Risk')->count();
      }

      $sparkScreening[] = $sSum;
      $sparkFollowup[] = $fSum;
      $sparkPatient[] = $pSum;
      $sparkHighRisk[] = $hSum;
    }

    return [
      ['key' => 'patients', 'label' => 'Total Pasien', 'value' => $totalPatients, 'trend' => $sparkPatient, 'icon' => 'users'],
      ['key' => 'screenings', 'label' => 'Total Skrining', 'value' => $totalScreenings, 'trend' => $sparkScreening, 'icon' => 'scan-heart'],
      ['key' => 'followups', 'label' => 'Total Tindak Lanjut', 'value' => $totalFollowups, 'trend' => $sparkFollowup, 'icon' => 'activity'],
      ['key' => 'high_risk', 'label' => 'Risiko Tinggi', 'value' => $totalHighRisk, 'trend' => $sparkHighRisk, 'icon' => 'alert-triangle'],
    ];
  }
}
