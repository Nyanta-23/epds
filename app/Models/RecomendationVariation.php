<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecomendationVariation extends Model
{
    use HasUuids;

    protected $fillable = [
        'recomendation_text',
        'generated_at',
        'recomendation_rule_id',
    ];


    public function recomendationRule(): BelongsTo
    {
        return $this->belongsTo(RecomendationRule::class);
    }
}
