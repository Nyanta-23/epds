<?php

namespace App\Models;

use App\Enums\BabyConditionEnum;
use App\Enums\BabyTypeOfDeliveryEnum;
use App\Enums\FeedTyperEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Baby extends Model
{
    use HasFactory, HasUuids, SoftDeletes;


    protected $fillable = [
        'which_child',
        'date_of_birth',
        'baby_condition',
        'typeof_delivery',
        'gender',
        'mother_id',
        'feed_type'
    ];

    protected $casts = [
        'baby_condition' => BabyConditionEnum::class,
        'typeof_delivery' => BabyTypeOfDeliveryEnum::class,
        'feed_type' => FeedTyperEnum::class,
        'date_of_birth' => 'datetime'
    ];

    public function mother(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function postpartumVisit(): HasOne
    {
        return $this->hasOne(PostpartumVisit::class);
    }
}
