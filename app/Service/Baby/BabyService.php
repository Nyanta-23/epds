<?php

namespace App\Service\Baby;

use App\DTO\Request\Baby\BabyStoreAttributeRequest;
use App\DTO\Request\Baby\BabyUpdateAttributeRequest;
use App\Models\Baby;
use Illuminate\Support\Facades\DB;

class BabyService
{
  public function index($filters)
  {
    $search = $filters['search'] ?? null;
    $onlyTrash = $filters['only_trash'] ?? false;

    $query = Baby::with('mother')
      ->when($search, function ($q, $search) {
        // mungkin lebih masuk akal kalau filter pakai nama ibu
        $q->whereHas('mother', fn($sub) => $sub->where('name', 'like', "%{$search}%"));
      })
      ->when($onlyTrash, fn($q) => $q->onlyTrashed())
      ->latest();

    return $query->paginate(10)->withQueryString();
  }

  public function store(BabyStoreAttributeRequest $request): Baby
  {
    return DB::transaction(function () use ($request) {
      return Baby::create([
        'which_child' => $request->which_child,
        'date_of_birth' => $request->date_of_birth,
        'baby_condition' => $request->baby_condition,
        'typeof_delivery' => $request->typeof_delivery,
        'gender' => $request->gender,
        'mother_id' => $request->mother_id,
      ]);
    });
  }

  public function update(BabyUpdateAttributeRequest $request, string $id): Baby
  {
    return DB::transaction(function () use ($request, $id) {
      $baby = Baby::findOrFail($id);

      $baby->update([
        'which_child' => $request->which_child,
        'date_of_birth' => $request->date_of_birth,
        'baby_condition' => $request->baby_condition,
        'typeof_delivery' => $request->typeof_delivery,
        'gender' => $request->gender,
        'mother_id' => $request->mother_id,
      ]);

      return $baby;
    });
  }

  public function softDelete(string $id): bool
  {
    return DB::transaction(function () use ($id) {
      $baby = Baby::findOrFail($id);
      return $baby->delete();
    });
  }
}
