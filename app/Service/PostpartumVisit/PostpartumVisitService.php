<?php

namespace App\Service\PostpartumVisit;

use App\DTO\Request\PostpartumVisit\PostpartumVisitStoreAttributeRequest;
use App\DTO\Request\PostpartumVisit\PostpartumVisitUpdateAttributeRequest;
use App\Models\PostpartumVisit;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PostpartumVisitService
{
  public function index($filters)
  {
    $search = $filters['search'];
    $verified = filter_var($filters['filter_list']['select_filter']['is_verified'], FILTER_VALIDATE_BOOLEAN);
    $canVisit = filter_var($filters['filter_list']['select_filter']['is_can_visit'], FILTER_VALIDATE_BOOLEAN);
    $isFollowed = filter_var($filters['is_followed'], FILTER_VALIDATE_BOOLEAN);

    $query = PostpartumVisit::with([
      'mother',
      'result',
      'result.followup',
      'answers',
      'answers.question',
      'answers.question.optionQuestions'
    ])
      ->when($search, function ($query, $search) {
        $query->where(function ($q) use ($search) {
          $searchTerms = '%' . $search . '%';

          $q->whereHas('mother', function ($q) use ($searchTerms) {
            $q->where('name', 'like', $searchTerms);
          });
        });
      })
      ->when($isFollowed, function ($q) {
        $q->whereHas('result', fn($r) => $r->whereNotNull('followup_id'));
      })
      ->when(!$isFollowed, function ($q) {
        $q->whereHas('result', fn($r) => $r->whereNull('followup_id'));
      })
      ->when($verified, fn($q) => $q->where('is_verified', $verified))
      ->when($canVisit, fn($q) => $q->where('is_can_visit', $canVisit))
      ->latest();

    return $query->paginate(10)->withQueryString();
  }


  public function update(PostpartumVisitUpdateAttributeRequest $request, string $id)
  {
    return DB::transaction(function () use ($request, $id) {
      PostpartumVisit::findOrFail($id)
        ->update([
          'visit_number'      => $request->visit_number,
          'date_filled'       => $request->date_filled,

          'sleep_quality'     => $request->sleep_quality,
          'partner_support'   => $request->partner_support,
          'live_with_partner' => $request->live_with_partner,
          'family_economy'    => $request->family_economy,

          'psych_history'     => $request->psych_history,
          'psych_treatment'   => $request->psych_treatment,
          'psych_trauma'      => $request->psych_trauma,

          'parity_count'      => $request->parity_count,
          'preg_comp_history' => $request->preg_comp_history,

          'last_comp'         => $request->last_comp,
          'last_comp_note'    => $request->last_comp_note,

          'baby_healthy'      => $request->baby_healthy,
          'baby_caregiver'    => $request->baby_caregiver,

          'feed_type'         => $request->feed_type,
        ]);
    });
  }

  // Api

  public function store(PostpartumVisitStoreAttributeRequest $request)
  {
    return DB::transaction(function () use ($request) {
      return PostpartumVisit::create([
        'visit_number'      => $request->visit_number,
        'date_filled'       => $request->date_filled,

        'sleep_quality'     => $request->sleep_quality,
        'partner_support'   => $request->partner_support,
        'live_with_partner' => $request->live_with_partner,
        'family_economy'    => $request->family_economy,

        'psych_history'     => $request->psych_history,
        'psych_treatment'   => $request->psych_treatment,
        'psych_trauma'      => $request->psych_trauma,

        'parity_count'      => $request->parity_count,
        'preg_comp_history' => $request->preg_comp_history,

        'last_comp'         => $request->last_comp,
        'last_comp_note'    => $request->last_comp_note,

        'baby_healthy'      => $request->baby_healthy,
        'baby_caregiver'    => $request->baby_caregiver,

        'feed_type'         => $request->feed_type,
        'mother_id'         => $request->mother_id
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
    return PostpartumVisit::where('mother_id', $user->id)->exists();
  }
}
