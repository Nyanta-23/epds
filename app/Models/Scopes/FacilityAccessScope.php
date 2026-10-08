<?php

namespace App\Models\Scopes;

use App\Models\Answer;
use App\Models\Baby;
use App\Models\Followup;
use App\Models\PostpartumVisit;
use App\Models\Result;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class FacilityAccessScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (! auth()->guard()->hasUser()) {
            return;
        }

        $user = auth()->user();
        $role = $user->role?->slug;

        if (in_array($role, ['super_admin', 'admin'], true)) {
            return;
        }

        if ($role === 'midwife') {
            $facilityId = $user->facility_id;

            if (! $facilityId) {
                $builder->whereRaw('1 = 0');

                return;
            }

            if ($model instanceof User || $model instanceof PostpartumVisit) {
                $builder->where('facility_id', $facilityId);
            } elseif ($model instanceof Baby) {
                $builder->whereHas('mother', fn (Builder $query) => $query->where('facility_id', $facilityId));
            } elseif ($model instanceof Followup || $model instanceof Result || $model instanceof Answer) {
                $builder->whereHas('postpartumVisit', fn (Builder $query) => $query->where('facility_id', $facilityId));
            }

            return;
        }

        if ($role === 'patient') {
            if ($model instanceof User) {
                $builder->whereKey($user->id);
            } elseif ($model instanceof PostpartumVisit || $model instanceof Baby) {
                $builder->where('mother_id', $user->id);
            } elseif ($model instanceof Followup || $model instanceof Result || $model instanceof Answer) {
                $builder->whereHas('postpartumVisit', fn (Builder $query) => $query->where('mother_id', $user->id));
            }

            return;
        }

        $builder->whereRaw('1 = 0');
    }
}
