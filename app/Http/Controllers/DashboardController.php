<?php

namespace App\Http\Controllers;

use App\Service\Dashboard\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function index()
    {


        $screeningDays = $this->dashboardService->postpartumScreeningLineDay();
        $sreeningWeeks = $this->dashboardService->postpartumScreeningLineWeekly();
        $screeningMonths = $this->dashboardService->postpartumScreeningLineMonth();


        $followUp = $this->dashboardService->followUp();
        $unFollowUp = $this->dashboardService->unFollowUp();

        $riskDistribution = $this->dashboardService->riskDistribution();

        $latestPostpartumData = $this->dashboardService->latestPostpartumData();
        


        return Inertia::render('dashboard', [
            'screenings' => [
                'screening_days' => $screeningDays,
                'screening_weeks' => $sreeningWeeks,
                'screening_months' => $screeningMonths
            ],
            "followups" => [$followUp, $unFollowUp],
            "risk_distributions" => $riskDistribution,
            "latest_postpartum_datas" => $latestPostpartumData
        ]);
    }
}
