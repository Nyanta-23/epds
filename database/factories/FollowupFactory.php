<?php

namespace Database\Factories;

use App\Models\PostpartumVisit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Followup>
 */
class FollowupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => rand(0, 2),
            'notes' => fake()->text(),
            'date_filled' => fake()->dateTime(),
            'midwife_id' => User::factory(),
            'postpartum_visit_id' => PostpartumVisit::factory(),
        ];
    }
}
