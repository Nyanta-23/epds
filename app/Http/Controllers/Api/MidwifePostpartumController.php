<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTO\Request\FollowUp\FollowUpStoreAttributeRequest;
use App\Http\Resources\PostpartumVisitResource;
use App\Models\PostpartumVisit;
use App\Models\Result;
use App\Service\FollowUp\FollowUpService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Log;

class MidwifePostpartumController extends Controller
{
  public function __construct(
    private FollowUpService $followUpService
  ) {
  }

  public function index(Request $request)
  {
    $preset = $request->input('preset', 'all');
    $search = $request->input('search');
    $risk = $request->input('risk', 'all');
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');

    if ($preset !== 'all' && $preset !== 'custom') {
      $now = now();
      $startDate = match ($preset) {
        'week' => $now->copy()->subWeek()->startOfDay(),
        'month' => $now->copy()->subMonth()->startOfDay(),
        'year' => $now->copy()->subYear()->startOfDay(),
        default => null
      };
      $endDate = $now->endOfDay();
    }

    $query = PostpartumVisit::with(['mother', 'result']);

    if ($search) {
      $query->whereHas('mother', function ($q) use ($search) {
        $q->where('name', 'like', "%$search%")
          ->orWhere('number_patient', 'like', "%$search%");
      });
    }

    if ($risk !== 'all') {
      $query->whereHas('result', function ($q) use ($risk) {
        $q->where('risk', $risk);
      });
    }

    if ($startDate && $endDate) {
      $query->whereBetween('date_filled', [$startDate, $endDate]);
    }

    $visits = $query->orderBy('date_filled', 'desc')->paginate(15)->through(function ($visit) {
        $totalScore = $visit->result?->total_score ?? 0;
        $riskLabel = $visit->result?->risk ?? 'Normal';
        
        return [
            'id' => $visit->id,
            'mother' => [
                'name' => $visit->mother?->name,
                'number_patient' => $visit->mother?->number_patient,
            ],
            'total_score' => $totalScore,
            'risk' => $riskLabel,
            'date_filled' => $visit->date_filled,
        ];
    });

    return response()->json($visits);
  }

  public function show($id)
  {
    $postpartum = PostpartumVisit::with([
      'mother',
      'result',
      'followup',
      'answers' => function ($query) {
        $query->with(['question' => function ($q) {
          $q->with('optionQuestions');
        }]);
      }
    ])->findOrFail($id);

    return response()->json([
      'data' => new PostpartumVisitResource($postpartum)
    ]);
  }

  public function storeFollowup(Request $request, $id)
  {
    return DB::transaction(function () use ($request, $id) {
      try {
        $user = auth()->user();
        $visit = PostpartumVisit::with('result')->findOrFail($id);
        $result = $visit->result;

        if (!$result) {
          return response()->json(['message' => 'Result not found'], 404);
        }

        $followUpReq = new FollowUpStoreAttributeRequest();
        $followUpReq->postpartum_visit_id = $visit->id;
        $followUpReq->followup_status = $request->input('followup_status');
        $followUpReq->notes = $request->input('notes');
        $followUpReq->type = $request->input('type');
        $followUpReq->result_id = $result->id;
        $followUpReq->midwife_id = $user->id;

        $this->followUpService->store($followUpReq);

        return response()->json([
          'message' => 'Successfully added follow up',
          'data' => new PostpartumVisitResource($visit->fresh(['followup', 'result', 'mother']))
        ], 201);
      } catch (\Exception $e) {
        Log::error('Error storing follow up: ' . $e->getMessage());
        return response()->json(['message' => $e->getMessage()], 500);
      }
    });
  }
}
