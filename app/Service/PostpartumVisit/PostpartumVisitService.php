<?php

namespace App\Service\PostpartumVisit;

use App\DTO\Request\PostpartumVisit\PostpartumVisitStoreAttributeRequest;
use App\DTO\Request\PostpartumVisit\PostpartumVisitUpdateAttributeRequest;
use App\Models\Baby;
use App\Models\Followup;
use App\Models\PostpartumVisit;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PostpartumVisitService
{
  public function index($filters)
  {
    $search = $filters['search'] ?? null;

    $verified = filter_var($filters['filter_list']['select_filter']['is_verified'] ?? null, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    $canVisit = filter_var($filters['filter_list']['select_filter']['is_can_visit'] ?? null, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    $isFollowed = filter_var($filters['is_followed'] ?? null, FILTER_VALIDATE_BOOLEAN);

    $query = PostpartumVisit::with([
      'mother',
      'result.followup',
      'answers.question.optionQuestions'
    ]);

    $query->when($search, function ($q, $search) {
      $q->whereHas('mother', fn($subQ) => $subQ->where('name', 'like', "%{$search}%"));
    });

    if ($isFollowed) {
      $query->whereHas('result.followup');
      $query->orderByDesc(
        Followup::select('updated_at')
          ->whereColumn('postpartum_visit_id', 'postpartum_visits.id')
          ->latest()
          ->limit(1)
      );
    } else {
      $query->whereDoesntHave('result.followup');
      $query->latest('created_at');
    }

    return $query->paginate(10)->withQueryString();
  }


  public function update(PostpartumVisitUpdateAttributeRequest $request, string $id)
  {
    return DB::transaction(function () use ($request, $id) {
      PostpartumVisit::findOrFail($id)
        ->update([
          'visit_number' => $request->visit_number,
          'date_filled' => $request->date_filled,

          'sleep_quality' => $request->sleep_quality,
          'partner_support' => $request->partner_support,
          'live_with_partner' => $request->live_with_partner,
          'family_economy' => $request->family_economy,

          'psych_history' => $request->psych_history,
          'psych_treatment' => $request->psych_treatment,
          'psych_trauma' => $request->psych_trauma,

          'parity_count' => $request->parity_count,
          'preg_comp_history' => $request->preg_comp_history,

          'last_comp' => $request->last_comp,
          'last_comp_note' => $request->last_comp_note,

          'baby_healthy' => $request->baby_healthy,
          'baby_caregiver' => $request->baby_caregiver,

          'feed_type' => $request->feed_type,
        ]);
    });
  }

  // Api

  public function store(PostpartumVisitStoreAttributeRequest $request)
  {
    return DB::transaction(function () use ($request) {
      return PostpartumVisit::create([
        'visit_number' => $request->visit_number,
        'date_filled' => $request->date_filled,

        'sleep_quality' => $request->sleep_quality,
        'partner_support' => $request->partner_support,
        'live_with_partner' => $request->live_with_partner,
        'family_salary_permonth' => $request->family_salary_permonth,
        'dependent_family_count' => $request->dependent_family_count,
        'is_salary_sufficient' => $request->is_salary_sufficient,

        'psych_history' => $request->psych_history,
        'psych_treatment' => $request->psych_treatment,
        'psych_trauma' => $request->psych_trauma,

        'parity_count' => $request->parity_count,
        'preg_comp_history' => $request->preg_comp_history,

        'last_comp' => $request->last_comp,
        'last_comp_note' => $request->last_comp_note,

        'baby_healthy' => $request->baby_healthy,
        'baby_caregiver' => json_encode($request->baby_caregiver),
        'baby_id' => $request->baby_id,
        'feed_type' => $request->feed_type,
        'mother_id' => $request->mother_id
      ]);
    });
  }

  public function previousDataFromUser(User $user)
  {
    return PostpartumVisit::with(['answers', 'result'])
      ->where('mother_id', $user->id)
      ->latest('date_filled')
      ->first();
  }

  public function hasPrevious(User $user): bool
  {
    $latestBaby = Baby::where('mother_id', $user->id)
      ->orderBy('date_of_birth', 'desc')
      ->first();
    return PostpartumVisit::where('mother_id', $user->id)->where('baby_id', $latestBaby->baby_id)->exists();
  }


  public function getPostpartumVisitById(string $id)
  {
    return PostpartumVisit::with([
      'answers',
      'answers.question',
      'answers.question.optionQuestions',
      'result',
      'result.followup'
    ])->findOrFail($id);
  }
}
