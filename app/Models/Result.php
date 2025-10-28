<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Result extends Model
{
    use HasUuids, HasFactory;

    public function postpartumVisit(): BelongsTo
    {
        return $this->belongsTo(PostpartumVisit::class);
    }

    public function followUp(): HasOne
    {
        return $this->hasOne(Followup::class);
    }

    public function autoRecomendation(): HasOne
    {
        return $this->hasOne(AutoRecomendation::class);
    }
}
