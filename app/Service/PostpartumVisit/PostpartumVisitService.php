<?php

namespace App\Service\PostpartumVisit;

use App\Models\PostpartumVisit;

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
}
