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

        // $parityGroup = fake()->numberBetween(1, 4);
        $lastComp = fake()->boolean();

        $dateFake = fake()->dateTimeBetween('first day of this month', 'now');

        return [
            // 'mother_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            // 'mother_id' => User::factory(),  
            // 'visit_number' => rand(1, 4),
            'date_filled' => $dateFake,
            // 'sleep_quality' => fake()->randomElement(['good', 'poor', 'frequently_awake']),
            'sleep_quality' => fake()->numberBetween(0, 2),
            // 'partner_support' => fake()->randomElement(['good', 'fair', 'poor']),
            'partner_support' => fake()->numberBetween(0, 2),
            'live_with_partner' => rand(0, 1),
            // 'family_economy' => fake()->randomElement(['good', 'sufficient', 'insufficient']),
            // 'family_economy' => fake()->numberBetween(0, 2),
            'family_salary_permonth' => rand(0, 2),
            'dependent_family_count' => rand(0, 2),
            'is_salary_sufficient' => rand(0, 2),
            'psych_history' => rand(0, 1),
            'psych_treatment' => fake()->boolean(),
            'psych_trauma' => fake()->boolean(),
            'last_comp' => $lastComp,
            'last_comp_note' => $lastComp ? fake()->sentence() : null,
            'preg_comp_history' => fake()->boolean(),
            // 'parity_group' => fake()->randomElement(['1x', '2x', '3x', '>3x']),
            // 'parity_group' => $parityGroup,
            'parity_count' => fake()->randomElement(['1', '2-4', '>5']),
            'baby_healthy' => fake()->boolean(),
            // 'baby_caregiver' => fake()->randomElement(['partner', 'parents', 'family/caregivers', 'none']),
            // 'baby_caregiver' => fake()->numberBetween(0, 3),
            // 'baby_caregiver' => fake()->randomElements([0, 1, 2, 3], rand(0, 2)),
            'baby_caregiver' => [fake()->numberBetween(0, 3)],
            // 'feed_type' => fake()->randomElement(['Exclusive breastfeeding', 'Mixed breastfeeding and formula feeding', 'Formula feeding only']),
            'feed_type' =>  fake()->numberBetween(0, 2),

            'created_at' => $dateFake,
            'updated_at' => $dateFake
        ];
    }
}
