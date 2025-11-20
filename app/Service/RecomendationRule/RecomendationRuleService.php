<?php

namespace App\Service\RecomendationRule;

use App\DTO\Request\RecomendationRule\RecomendationRuleStoreAttributeRequest;
use App\DTO\Request\RecomendationRule\RecomendationRuleUpdateAttributeRequest;
use App\Models\RecomendationRule;
use Illuminate\Support\Facades\DB;

class RecomendationRuleService
{
  public function index($filters)
  {
    $search = $filters['search'];
    // $onlyTrash = $filters['only_trash'];


    $query = RecomendationRule::when($search, function ($q, $search) {
      $q->where('name', 'like', "%{$search}%");
    })
      // ->when($onlyTrash, fn($q) => $q->onlyTrashed())
      ->latest();

    return $query->paginate(10)->withQueryString();
  }

  public function store(RecomendationRuleStoreAttributeRequest $request)
  {
    return DB::transaction((function () use ($request) {
      RecomendationRule::create([
        'name' => $request->name,
        'description' => $request->description,
        'min_score' => $request->min_score,
        'max_score' => $request->max_score,
      ]);
    }));
  }

  public function update(RecomendationRuleUpdateAttributeRequest $request, string $id)
  {
    return DB::transaction(function () use ($request, $id) {
      RecomendationRule::findOrFail($id)->update([
        'name' => $request->name,
        'description' => $request->description,
        'min_score' => $request->min_score,
        'max_score' => $request->max_score,
      ]);
    });
  }

  public function softDelete(string $id)
  {
    return DB::transaction(function () use ($id) {
      $toneCategory = RecomendationRule::findOrFail($id);

      $toneCategory->delete();

      return $toneCategory;
    });
  }
}
