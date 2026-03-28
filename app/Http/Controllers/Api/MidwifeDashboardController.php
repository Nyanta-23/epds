<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\Dashboard\DashboardService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MidwifeDashboardController extends Controller
{

  public function __construct(
    private DashboardService $dashboardService
  ) {
  }

  public function index(Request $request)
  {
    // ── Resolve filter params ─────────────────────────────────────
    $preset = $request->input('preset', 'week');   // week|month|year|custom
    $riskType = $request->input('risk', 'all');       // all|normal|low|high
    $dateFrom = $request->input('date_from');
    $dateTo = $request->input('date_to');

    [$from, $to] = $this->resolveRange($preset, $dateFrom, $dateTo);

    $screeningDays = $this->dashboardService->postpartumScreeningLineDay($from, $to);
    $screeningWeeks = $this->dashboardService->postpartumScreeningLineWeekly($from, $to);
    $screeningMonths = $this->dashboardService->postpartumScreeningLineMonth($from, $to);

    $followUpStats = $this->dashboardService->followUpStats($from, $to);
    $riskDistribution = $this->dashboardService->riskDistribution($from, $to);
    $latestPostpartumData = $this->dashboardService->latestPostpartumData($from, $to, $riskType);
    $summaryStats = $this->dashboardService->summaryStats($from, $to);

    return response()->json([
      'data' => [
        'screenings' => [
          'screening_days' => $screeningDays,
          'screening_weeks' => $screeningWeeks,
          'screening_months' => $screeningMonths,
        ],
        'followups' => [$followUpStats['follow_up'], $followUpStats['unfollow_up']],
        'risk_distributions' => $riskDistribution,
        'latest_postpartum_datas' => $latestPostpartumData,
        'stats' => $summaryStats,
        'filters' => [
          'preset' => $preset,
          'risk' => $riskType,
          'date_from' => $from->toDateString(),
          'date_to' => $to->toDateString(),
        ],
        'unreadNotifications' => auth()->user()?->unreadNotifications()->count() ?? 0,
      ]
    ]);
  }

  /**
   * Resolve a [from, to] Carbon pair from preset or custom dates.
   *
   * @return array{Carbon, Carbon}
   */
  private function resolveRange(string $preset, ?string $dateFrom, ?string $dateTo): array
  {
    if ($preset === 'custom' && $dateFrom && $dateTo) {
      return [
        Carbon::parse($dateFrom)->startOfDay(),
        Carbon::parse($dateTo)->endOfDay(),
      ];
    }

    return match ($preset) {
      'month' => [now()->subMonths(1)->startOfDay(), now()->endOfDay()],
      'year' => [now()->subYear()->startOfDay(), now()->endOfDay()],
      default => [now()->subWeek()->startOfDay(), now()->endOfDay()], // 'week'
    };
  }
}
