<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\PostpartumVisit\PostpartumScheduleService;
use App\Service\PostpartumVisit\PostpartumVisitService;
use Illuminate\Http\Request;

class PostpartumController extends Controller
{
    public function __construct(
        private PostpartumScheduleService $postpartumScheduleService,
        private PostpartumVisitService $postpartumVisitService
    ) {
    }

    public function getSchedule(Request $request, string $motherId)
    {
        $schedule = $this->postpartumScheduleService->getScheduleForMother($motherId);

        return response()->json([
            'message' => 'Postpartum schedule retrieved successfully',
            'data' => $schedule
        ]);
    }

    public function previousPostpartumVisit()
    {
        try {
            $user = auth()->user();
            $hasPrevious = $this->postpartumVisitService->hasPrevious($user);

            if ($hasPrevious) {
                $previousPostpartumVisit = $this->postpartumVisitService->previousDataFromUser($user);
            } else {
                $previousPostpartumVisit = null;
            }

            return response()->json([
                'message' => 'Previous postpartum visit fetched successfully.',
                'data' => $previousPostpartumVisit
            ], 200);
        } catch (\Exception $err) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $err->getMessage()
            ], 500);
        }
    }
}
