<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PostpartumVisit>
 */
class PostpartumVisitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'mother_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'mother_id' => User::factory(),
            'date_filled' => fake()->dateTime(),
            'sleep_quality' => fake()->randomElement(['good', 'poor', 'frequently_awake']),
            'support_level' => fake()->randomElement(['good', 'fair', 'poor']),
            'socioeconomic_issues' => rand(0, 1),
            'psych_history' => rand(0, 1)
        ];
    }
}
