<?php

namespace App\Models;

use App\Enums\FollowUpTypeEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Followup extends Model
{
    use HasUuids, HasFactory;

    protected $casts = [
        'type' => FollowUpTypeEnum::class,
    ];

    protected $fillable = [
        'type',
        'notes',
        'midiwife_id',
        'result_id'
    ];

    public function midwife(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function result(): BelongsTo
    {
        return $this->belongsTo(Result::class);
    }
}
