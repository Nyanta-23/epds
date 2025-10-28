<?php

namespace Database\Seeders;

use App\Models\ToneCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ToneCategoryAndRecomendationRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $toneCategories = [
            [
                'name' => 'Normal',
                'rule' => [

                    'min_score' => 0,
                    'max_score' => 9

                ]
            ],
            [
                'name' => 'Resiko Ringan',
                'description' => 'Perlu pemantauan lebih lanjut',
                'rule' => [

                    'min_score' => 10,
                    'max_score' => 12

                ]
            ],
            [
                'name' => 'Risiko Sedang',
                'description' => 'Pertimbangkan rujukan ke Psikolog atau ke Psikiater',
                'rule' =>
                [
                    'min_score' => 13,
                    'max_score' => 19
                ]
            ],
            [
                'name' => 'Risiko Sedang',
                'description' => 'Segera rujuk ke tenaga kesehatan mental',
                'rule' => [
                    'min_score' => 20,
                ]
            ],
        ];


        foreach ($toneCategories as $data) {
            $category = ToneCategory::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null
            ]);

            $category->recomendationRule()->create($data['rule']);
        }
    }
}
