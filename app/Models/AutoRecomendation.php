<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutoRecomendation extends Model
{
    use HasUuids;

    public function recomendationVariation(): BelongsTo
    {
        return $this->belongsTo(RecomendationVariation::class);
    }

    public function result(): BelongsTo
    {
        return $this->belongsTo(Result::class);
    }
}
