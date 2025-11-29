<?php

namespace App\Models;

use App\Enums\FollowUpStatusEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Result extends Model
{
    use HasUuids, HasFactory;

    protected $casts = [
        'followup_status' => FollowUpStatusEnum::class
    ];

    protected $fillable = [
        'total_score',
        'postpartum_visit_id',
        'followup_status',
        'followup_id'
    ];

    public function postpartumVisit(): BelongsTo
    {
        return $this->belongsTo(PostpartumVisit::class);
    }

    public function followup(): BelongsTo
    {
        return $this->belongsTo(Followup::class);
    }

    public function autoRecomendation(): HasOne
    {
        return $this->hasOne(AutoRecomendation::class);
    }
}
