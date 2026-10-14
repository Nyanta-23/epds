<?php

namespace App\Http\Controllers;

use App\Service\Recapitulation\RecapitulationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecapitulationController extends Controller
{
    public function __construct(private RecapitulationService $recapitulationService) {}

    public function index(): Response
    {
        $user = auth()->user();

        $facilites = $this->recapitulationService->getFacilities($user->facility_id, $user->role->slug);

        return Inertia::render('recapitulation', [
            'facilities' => $facilites,
        ]);
    }

    public function show(Request $request, string $facilityId): Response
    {
        $preset = $request->input('preset', 'all');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        [$from, $to] = match ($preset) {
            'week' => [now()->subWeek()->startOfDay(), now()->endOfDay()],
            'month' => [now()->subMonth()->startOfDay(), now()->endOfDay()],
            'year' => [now()->subYear()->startOfDay(), now()->endOfDay()],
            'custom' => ($dateFrom && $dateTo)
                ? [Carbon::parse($dateFrom)->startOfDay(), Carbon::parse($dateTo)->endOfDay()]
                : [null, null],
            default => [null, null],
        };

        $facility = $this->recapitulationService->getFacilityDetail($facilityId);
        $recaps = $this->recapitulationService->recaps($facilityId, $from, $to);
        $visits = $this->recapitulationService->getFacilityVisits($facilityId, $from, $to, 10);

        return Inertia::render('recapitulation/show', [
            'facility' => $facility,
            'recaps' => $recaps,
            'visits' => $visits,
            'filters' => [
                'preset' => $preset,
                'date_from' => $dateFrom ?? ($from?->toDateString()),
                'date_to' => $dateTo ?? ($to?->toDateString()),
            ],
        ]);
    }
}
