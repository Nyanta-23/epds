<?php

namespace App\Service\PostpartumVisit;

use App\DTO\Request\PostpartumVisit\PostpartumVisitUpdateAttributeRequest;
use App\Models\PostpartumVisit;
use Illuminate\Support\Facades\DB;

class PostpartumVisitService
{
  public function index($filters)
  {
    $search = $filters['search'];
    $verified = filter_var($filters['filter_list']['select_filter']['is_verified'], FILTER_VALIDATE_BOOLEAN);
    $canVisit = filter_var($filters['filter_list']['select_filter']['is_can_visit'], FILTER_VALIDATE_BOOLEAN);

    $query = PostpartumVisit::with([
      'mother',
      'result',
      'answers.question.optionQuestions'
    ])
      ->whereHas('mother.role', function ($query) {
        $query->where('slug', 'patient');
      })
      ->when($search, function ($query, $search) {
        $query->where(function ($q) use ($search) {
          $searchTerms = '%' . $search . '%';
          $q->where('name', 'like', $searchTerms);
        });
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
}
