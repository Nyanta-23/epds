<?php

namespace Database\Seeders;

use App\Models\RecomendationRule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecomendationRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        RecomendationRule::create([
            'name' => 'Normal',
            'max_score' => 9
        ]);

        RecomendationRule::create([
            'name' => 'Resiko Ringan',
            'description' => 'Perlu pemantauan lebih lanjut',
            'min_score' => 10,
            'max_score' => 12
        ]);

        RecomendationRule::create([
            'name' => 'Risiko Sedang',
            'description' => 'Pertimbangkan rujukan ke Psikolog atau ke Psikiater',
            'min_score' => 13,
            'max_score' => 19
        ]);


        RecomendationRule::create([
            'name' => 'Risiko Tinggi',
            'description' => 'Segera rujuk ke tenaga kesehatan mental',
            'min_score' => 20,
        ]);

    }
}
