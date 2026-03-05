<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class RegionAccessScope implements Scope
{
  public function apply(Builder $builder, Model $model)
  {
    if (app()->runningInConsole() || !auth()->check()) {
      return;
    }

    $user = auth()->user();
    $roleSlug = $user->role?->slug ?? '';

    if (in_array($roleSlug, ['super_admin', 'admin'])) {
      return;
    }

    if ($roleSlug === 'patient') {
      $builder->where('mother_id', $user->id);
      return;
    }
    if ($roleSlug === 'midwife') {
      // Prioritas: desa → kecamatan → kabupaten/kota → tidak ada akses
      if ($user->village_id) {
        $builder->whereHas('mother', function ($query) use ($user) {
          $query->where('village_id', $user->village_id);
        });
        return;
      }
      if ($user->subdistrict_id) {
        $builder->whereHas('mother', function ($query) use ($user) {
          $query->where('subdistrict_id', $user->subdistrict_id);
        });
        return;
      }
      if ($user->city_or_district_id) {
        $builder->whereHas('mother', function ($query) use ($user) {
          $query->where('city_or_district_id', $user->city_or_district_id);
        });
        return;
      }
      // Bidan tidak punya wilayah terdaftar — tampilkan semua data
      return;
    }
  }
}