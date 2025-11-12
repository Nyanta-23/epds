<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= 'password',
            'remember_token' => Str::random(10),
            // 'two_factor_secret' => Str::random(10),
            // 'two_factor_recovery_codes' => Str::random(10),
            // 'two_factor_confirmed_at' => now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model does not have two-factor authentication configured.
     */
    public function withoutTwoFactor(): static
    {
        return $this->state(fn(array $attributes) => [
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);
    }

    public function patient(): static
    {
        return $this->state(fn(array $attributes) => [
            'phone_number' => fake()->phoneNumber(),
            'birthplace' => fake()->city(),
            'date_of_birth' => fake()->date(),
            'job' => fake()->sentence(),
            'married_status' => fake()->randomElement(['married', 'not_married', 'divorced']),
            'highest_education' => Str::random(10),
            'province' => fake()->state(),
            'city_or_district' => fake()->city(),
            'subdistrict' => fake()->streetName(),
            'village' => fake()->streetName(),
            'address' => fake()->address(),
            'verified' => rand(0, 1)
        ]);
    }


    public function withRole(string $slug): static
    {
        return $this->state(
            fn(array $attributes) => [
                'role_id' => Role::where('slug', $slug)->first()->id ?? null
            ]
        );
    }
}
