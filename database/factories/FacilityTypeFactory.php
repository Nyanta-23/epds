<?php

namespace Database\Factories;

use App\Models\FacilityType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FacilityType>
 */
class FacilityTypeFactory extends Factory
{
    protected $model = FacilityType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => (string) \Str::uuid(),
            'name' => $this->faker->word,
        ];
    }
}
