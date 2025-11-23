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


        return Inertia::render('dashboard', [
            'screenings' => [
                'screening_days' => $screeningDays,
                'screening_weeks' => $sreeningWeeks,
                'screening_months' => $screeningMonths
            ]
        ]);
    }
}
