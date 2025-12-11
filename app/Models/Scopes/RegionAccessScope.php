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
        if ($user->role === 'super_admin') { 
            return;
        }

        // 2. PASIEN (Lihat Data Sendiri)
        if ($user->role === 'patient') {
            $builder->where('mother_id', $user->id);
            return;
        }
        if ($user->role === 'midwife') {
            
            if ($user->village_id) {
                $builder->whereHas('mother', function ($query) use ($user) {
                    $query->where('village_id', $user->village_id);
                });
                return;
            }
            if ($user->district_id) {
                $builder->whereHas('mother', function ($query) use ($user) {
                    $query->where('district_id', $user->district_id);
                });
                return;
            }
            $builder->whereRaw('1 = 0'); 
        }
    }
}