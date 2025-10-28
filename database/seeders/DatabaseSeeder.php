<?php

namespace Database\Seeders;

use App\Models\Baby;
use App\Models\Permission;
use App\Models\PostpartumVisit;
use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::firstOrCreate(
        //     ['email' => 'test@example.com'],
        //     [
        //         'name' => 'Test User',
        //         'password' => 'test@example.com',
        //         // 'email_verified_at' => now(),
        //     ]
        // );



        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
            QuestionAndOptionQuestionSeeder::class,
            ToneCategoryAndRecomendationRuleSeeder::class,
            RecomendationVariationSeeder::class
        ]);

        User::create([
            'name' => 'Super Admin',
            'email' => 'test@example.com',
            'email_verified_at' => null,
            'password' => Hash::make('test@example.com'),
            'remember_token' => Str::random(10),
            'two_factor_secret' => Str::random(10),
            'two_factor_recovery_codes' => Str::random(10),
            'two_factor_confirmed_at' => null,
            'role_id' => Role::where('slug', 'super_admin')->first()->id
        ]);

        User::factory()->withRole('admin')->count(3)->create();
        User::factory()->withRole('midwife')->count(10)->create();

        $mothers =  User::factory()->patient()->withRole('patient')->count(14)->create();


        $permissions = Permission::pluck('id', 'slug')->toArray();

        $superAdmin = Role::where('slug', 'super_admin')->first();
        $admin = Role::where('slug', 'admin')->first();
        $midwife = Role::where('slug', 'midwife')->first();
        $patient = Role::where('slug', 'patient')->first();

        $superAdmin->permissions()->sync(
            array_map(fn($slug) => $permissions[$slug], ['system.manage_all'])
        );

        $adminPermissions = [
            'system.manage_operational',
            'export.data',
            'import.data',
        ];

        $admin->permissions()->sync(
            array_map(fn($slug) => $permissions[$slug], $adminPermissions)
        );

        $midwifePermissions = [
            'user.view',
            'user.update',
            'baby.list',
            'postpartum_visit.list',
            'result.list',
            'followup.create',
            'followup.update',
            'followup.view',
        ];

        $midwife->permissions()->sync(
            array_map(fn($slug) => $permissions[$slug], $midwifePermissions)
        );

        $patientPermissions = [
            'baby.create',
            'baby.list',
            'postpartum_visit.create',
            'postpartum_visit.list',
            'answer.create',
            'result.list',
        ];

        $patient->permissions()->sync(
            array_map(fn($slug) => $permissions[$slug], $patientPermissions)
        );

        $mothers->each(function ($mother) {
            Baby::factory()->count(rand(1, 3))->create(['mother_id' => $mother->id]);

            $postpartums = PostpartumVisit::factory()->count(rand(0, 5))->create(['mother_id' => $mother->id]);


            $postpartums->each(function ($visit) {

                $result = $visit->result()->create([
                    'total_score' => rand(0, 30),
                    'followup_status' => fake()->randomElement([
                        'not_counsuled',
                        'counsuled',
                        'refer_psychologist',
                        'refer_psyichiatrist'
                    ]),
                ]);



                $result->followUp()->create([
                    'type' => fake()->randomElement(['education', 'reference', 'monitoring']),
                    'notes' => fake()->text(),
                    'date_filled' => fake()->dateTime(),
                    'midwife_id' => User::inRandomOrder()->whereHas('role', fn($q) => $q->where('slug', 'midwife'))->first()->id
                ]);
            });
        });
    }
}
