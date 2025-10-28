<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Result>
 */
class ResultFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'postpartum_visit_id' => PostpartumVisit::factory(),
            'total_score' => fake()->numberBetween(0, 30),
            'followup_status' => fake()->randomElement(['not_counsuled', 'counsuled', 'refer_psychologist', 'refer_psyichiatrist']),
        ];
    }
}
