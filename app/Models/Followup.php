<?php

namespace App\Models;

use App\Enums\FollowUpTypeEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Followup extends Model
{
    use HasUuids, HasFactory;

    protected $casts = [
        'type' => FollowUpTypeEnum::class,
    ];

    protected $fillable = [
        'type',
        'notes',
        'midwife_id',
        'result_id',
        'date_filled',
        'postpartum_visit_id'
    ];

    public function midwife(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function result(): HasOne
    {
        return $this->hasOne(Result::class);
    }
}
