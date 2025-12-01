<?php

namespace App\Service\Dashboard;

use App\Models\Followup;
use App\Models\PostpartumVisit;
use Illuminate\Support\Facades\DB;

class DashboardService
{
  public function postpartumScreeningLineDay()
  {

    $results = [];

    for ($i = 6; $i >= 0; $i--) {
      $date = now()->copy()->subDays($i);

      $results[] = [
        'day' => $date->englishDayOfWeek,
        'date' => $date->toDateString(),
        'total' => PostpartumVisit::whereDate('date_filled', $date)->count()
      ];
    }

    return array_reverse($results);
  }


  public function postpartumScreeningLineWeekly()
  {
    $results = [];

    for ($i = 3; $i >= 0; $i--) {
      $weekDate = now()->copy()->subWeeks($i);

      $start = $weekDate->copy()->startOfWeek();
      $end = $weekDate->copy()->endOfWeek();

      $weekNumber = 3 - $i + 1;

      $results[] = [
        'week' => "Week $weekNumber",
        'start' => $start->toDateString(),
        'end' => $end->toDateString(),
        'total' => PostpartumVisit::whereBetween('date_filled', [
          $start->toDateString(),
          $end->toDateString()
        ])->count()
      ];
    }

    return array_reverse($results);
  }


  public function postpartumScreeningLineMonth()
  {
    $results = [];

    for ($i = 11; $i >= 0; $i--) {
      $date = now()->copy()->subMonths($i);

      $results[] = [
        'month' => $date->englishMonth,
        'year' => $date->year,
        'total' => PostpartumVisit::whereYear('date_filled', $date->year)
          ->whereMonth('date_filled', $date->month)
          ->count()
      ];
    }


    return array_reverse($results);
  }


  public function followUp()
  {
    $unFollowUp = PostpartumVisit::all()->count();
    $followUp = Followup::all()->count();

    $result = $followUp < 0 ?  $followUp / ($followUp + $unFollowUp) * 100 : 0;

    return [
      'label' => 'Follow Up',
      'data' => round($result)
    ];
  }

  public function unFollowUp()
  {
    $unFollowUp = PostpartumVisit::all()->count();
    $followUp = Followup::all()->count();

    $result = $unFollowUp < 0 ? $unFollowUp / ($followUp + $unFollowUp) * 100 : 0;

    return [
      'label' => 'Un Follow Up',
      'data' => round($result)
    ];
  }

  public function riskDistribution()
  {
    $visits = PostpartumVisit::with('result')
      // ->whereDate('date_filled', [now()->startOfWeek(), now()->endOfWeek()])
      ->whereBetween('date_filled', [
        now()->startOfWeek()->toDateString(),
        now()->endOfWeek()->toDateString(),
      ])
      ->get();

    $normal = 0;
    $low = 0;
    $high = 0;


    foreach ($visits as $visit) {
      if (!$visit->result) continue;

      $score = $visit->result->total_score;

      $category = category_score($score);

      if ($category === "Normal") {
        $normal++;
      } elseif ($category === "Low Risk") {
        $low++;
      } else {
        $high++;
      }
    }

    return [
      ['label' => 'Normal', 'value' => $normal],
      ['label' => 'Low Risk', 'value' => $low],
      ['label' => 'High Risk', 'value' => $high],
    ];
  }



  public function latestPostpartumData()
  {
    $visits = PostpartumVisit::with(['mother', 'result'])
      ->orderBy('created_at', 'desc')
      ->take(6)
      ->get();

    return $visits->map(function ($visit) {
      return [
        'number_patient' => $visit->mother?->number_patient,
        'name' => $visit->mother?->name,
        'date_filled' => $visit->date_filled,
        'risk' => $visit->result
          ? category_score($visit->result->total_score)
          : 'No Result',
      ];
    })->toArray();
  }



  // public function postpartumScreeningLineMonth()
  // {
  //   $startOfMonth = now()->startOfMonth();

  //   $results = [];

  //   $orderedMonths = month_collection();

  //   foreach ($orderedMonths as $index => $monthName) {

  //     $date = $startOfMonth->copy()->addMonths($index)->toDateString();

  //     $count = PostpartumVisit::whereDate('date_filled', $date)->count();

  //     $results[] = [
  //       'month' => $monthName,
  //       'date' => $date,
  //       'total' => $count
  //     ];
  //   }

  //   return $results;
  // }
}
