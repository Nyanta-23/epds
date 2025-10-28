<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ToneCategory extends Model
{
     use HasUuids;

    public function recomendationRule(): HasOne
    {
        return $this->hasOne(RecomendationRule::class);
    }
}
