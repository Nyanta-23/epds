<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RecomendationRule extends Model
{
    use HasUuids;

    public function toneCategory(): BelongsTo
    {
        return $this->belongsTo(ToneCategory::class);
    }

    public function recomendationVariations(): HasMany
    {
        return $this->hasMany(RecomendationVariation::class);
    }
}
