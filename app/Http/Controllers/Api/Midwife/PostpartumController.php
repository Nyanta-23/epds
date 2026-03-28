<?php

namespace App\Http\Controllers\Api\Midwife;

use App\Http\Controllers\Controller;
use App\DTO\Request\FollowUp\FollowUpStoreAttributeRequest;
use App\Http\Resources\PostpartumVisitResource;
use App\Models\PostpartumVisit;
use App\Service\FollowUp\FollowUpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Log;

class PostpartumController extends Controller
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

    $query = PostpartumVisit::with(['mother', 'result', 'answers.question.optionQuestions']);

    if ($search) {
      $query->whereHas('mother', function ($q) use ($search) {
        $q->where('name', 'like', "%$search%")
          ->orWhere('number_patient', 'like', "%$search%");
      });
    }

    if ($startDate && $endDate) {
      $query->whereBetween('date_filled', [$startDate, $endDate]);
    }

    if ($risk !== 'all') {
      $hasSelfHarmClosure = function ($a) {
          $a->whereHas('question', function ($q) {
              $q->where('question', 'like', '%menyakiti diri%');
          })->whereExists(function ($query) {
              $query->select(\Illuminate\Support\Facades\DB::raw(1))
                    ->from('option_questions')
                    ->whereColumn('option_questions.question_id', 'answers.question_id')
                    ->whereRaw('LOWER(option_questions.option) = LOWER(answers.answer)')
                    ->where('option_questions.value', '>', 0);
          });
      };

      $query->where(function ($q) use ($risk, $hasSelfHarmClosure) {
          if ($risk === 'high') {
              $q->whereHas('result', function ($r) {
                  $r->where('total_score', '>=', 13);
              })->orWhereHas('answers', $hasSelfHarmClosure);
          } elseif ($risk === 'low') {
              $q->whereHas('result', function ($r) {
                  $r->whereBetween('total_score', [10, 12]);
              })->whereDoesntHave('answers', $hasSelfHarmClosure);
          } elseif ($risk === 'normal') {
              $q->whereHas('result', function ($r) {
                  $r->where('total_score', '<', 10);
              })->whereDoesntHave('answers', $hasSelfHarmClosure);
          }
      });
    }

    $visits = $query->orderBy('date_filled', 'desc')->paginate(15)->through(function ($visit) {
        return [
            'id' => $visit->id,
            'mother' => [
                'name' => $visit->mother?->name,
                'number_patient' => $visit->mother?->number_patient,
            ],
            'total_score' => $visit->result?->total_score ?? 0,
            'risk' => $visit->risk_status, // Using the new accessor
            'date_filled' => $visit->date_filled,
        ];
    });

    return response()->json($visits);
  }

  public function show($id)
  {
    $postpartum = PostpartumVisit::findOrFail($id);
    
    // Explicitly load everything to ensure resources get the data they need
    $postpartum->load([
      'mother',
      'result',
      'followup',
      'answers',
      'answers.question',
      'answers.question.optionQuestions'
    ]);

    return response()->json([
      'data' => new \App\Http\Resources\PostpartumVisitResource($postpartum)
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
