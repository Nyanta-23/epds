<?php

namespace Database\Factories;

use App\Models\District;
use App\Models\Facility;
use App\Models\FacilityType;
use App\Models\Province;
use App\Models\Regency;
use App\Models\Village;
use Illuminate\Database\Eloquent\Factories\Factory;
use Str;

class FacilityFactory extends Factory
{
    protected $model = Facility::class;

    public function definition()
    {
        return [
            'id' => (string) Str::uuid(),
            'parent_id' => '0',
            'name' => $this->faker->company,
            'facility_type_id' => FacilityType::factory(),
            'province_id' => Province::factory(),
            'regency_id' => Regency::factory(),
            'district_id' => District::factory(),
            'village_id' => Village::factory(),
        ];
    }
}
