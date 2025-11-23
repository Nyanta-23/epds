<?php

namespace App\Service\Dashboard;

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
