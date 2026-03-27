<?php

namespace App\Models;

use App\Enums\BabyCaregiverEnum;
use App\Enums\BabyConditionEnum;
use App\Enums\DependentFamilyCountEnum;
use App\Enums\FamilySalaryPerMonthEnum;
use App\Enums\FamilySalarySufficientEnum;
use App\Enums\FeedTyperEnum;
use App\Enums\PartnerSupportEnum;
use App\Enums\SleepQualityEnum;
use App\Models\Scopes\RegionAccessScope;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
        'baby_caregiver' => 'array',
        'feed_type' => FeedTyperEnum::class,
        'family_salary_permonth' => FamilySalaryPerMonthEnum::class,
        'dependent_family_count' => DependentFamilyCountEnum::class,
        'is_salary_sufficient' => FamilySalarySufficientEnum::class,
        'baby_healthy' => BabyConditionEnum::class,
        'feel_unsafe' => \App\Enums\FeelUnsafeEnum::class,
        'pregnancy_planned' => \App\Enums\PregnancyPlannedEnum::class,
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
        'baby_id',
        'feed_type',
        'mother_id',
        
        'feel_unsafe',
        'pregnancy_planned'
    ];

    protected function babyCaregiverLabel(): Attribute
    {
        return Attribute::make(
        get: function () {
            $data = $this->baby_caregiver;

            if (is_string($data)) {
                $data = json_decode($data, true);
            }
            $safeIds = is_array($data) ? $data : [];

            return BabyCaregiverEnum::getLabelsFromIds($safeIds);
        }
    );
    }

    public function result(): HasOne
    {
        return $this->hasOne(Result::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    public function followup(): HasOne
    {
        return $this->hasOne(Followup::class);
    }

    public function mother(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mother_id', 'id');
    }

    public function baby(): BelongsTo
    {
        return $this->belongsTo(Baby::class, 'baby_id', 'id');
    }

    /**
     * Aktifkan Global Scope
     */
    protected static function booted()
    {
        static::addGlobalScope(new RegionAccessScope);
    }
}
