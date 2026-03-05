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

    if (in_array($roleSlug, ['super_admin', 'admin', 'midwife'])) {
      return;
    }

    if ($roleSlug === 'patient') {
      $builder->where('mother_id', $user->id);
      return;
    }
  }
}