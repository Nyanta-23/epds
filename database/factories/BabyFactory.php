<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Baby>
 */
class BabyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mother_id' => User::factory(),
            'which_child' => rand(1, 3),
            'date_of_birth' => fake()->date(),
            'baby_condition' => fake()->randomElement(['healthy', 'premature', 'low_bw', 'nicu']),
            'breastfeeding_status' => fake()->randomElement(['exclusive', 'mixed', 'not_breastfeeding']),
            'delivery_complication' => rand(0, 1)
        ];
    }
}
