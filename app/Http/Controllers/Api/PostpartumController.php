<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\PostpartumVisit\PostpartumScheduleService;
use Illuminate\Http\Request;

class PostpartumController extends Controller
{
    public function __construct(private PostpartumScheduleService $postpartumScheduleService)
    {
    }

    public function getSchedule(Request $request, string $motherId)
    {
        $schedule = $this->postpartumScheduleService->getScheduleForMother($motherId);

        return response()->json([
            'message' => 'Postpartum schedule retrieved successfully',
            'data' => $schedule
        ]);
    }
}
