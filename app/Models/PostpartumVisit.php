<?php

namespace App\Models;

use App\Enums\BabyCaregiverEnum;
use App\Enums\DependentFamilyCountEnum;
use App\Enums\FamilySalaryPerMonthEnum;
use App\Enums\FamilySalarySufficientEnum;
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
        'baby_caregiver' => BabyCaregiverEnum::class,
        'feed_type' => FeedTyperEnum::class,
        'family_salary_permonth' => FamilySalaryPerMonthEnum::class,
        'dependent_family_count' => DependentFamilyCountEnum::class,
        'is_salary_sufficient' => FamilySalarySufficientEnum::class,
    ];

    protected $fillable = [
        'visit_number',
        'date_filled',

        'sleep_quality',
        'partner_support',
        'live_with_partner',
        'family_salary_permonth',
        'dependent_family_count',
        'is_salary_sufficient',

        'psych_history',
        'psych_treatment',
        'psych_trauma',

        'parity_count',
        'preg_comp_history',

        'last_comp',
        'last_comp_note',

        'baby_healthy',
        'baby_caregiver',

        'feed_type',
        'mother_id'
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
