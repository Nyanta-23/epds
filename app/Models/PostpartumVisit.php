<?php

namespace App\Models;

use App\Enums\BabyCaregiverEnum;
use App\Enums\FamilyEconomyEnum;
use App\Enums\FeedTyperEnum;
use App\Enums\PartnerSupportEnum;
use App\Enums\SleepQualityEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PostpartumVisit extends Model
{
    use HasUuids, HasFactory;


    protected $casts = [
        'sleep_quality' => SleepQualityEnum::class,
        'partner_support' => PartnerSupportEnum::class,
        'family_economy' => FamilyEconomyEnum::class,
        'baby_caregiver' => BabyCaregiverEnum::class,
        'feed_type' => FeedTyperEnum::class,
    ];

    public function mother(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function result(): HasOne
    {
        return $this->hasOne(Result::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }
}
